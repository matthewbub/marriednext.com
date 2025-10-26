import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { invitation, guest } from "@/drizzle/schema";
import { and, or, eq, ilike, asc, desc, sql, inArray } from "drizzle-orm";
import { z } from "zod";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";

const searchSchema = z.object({
  query: z.string().min(1),
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const wedding = await getCurrentWedding();

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const sortBy = searchParams.get("sortBy") || "alpha-asc";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const validatedData = searchSchema.parse({ query });
    const searchPattern = `%${validatedData.query}%`;

    const matchingGuests = await db.query.guest.findMany({
      where: and(
        eq(guest.weddingId, wedding.id),
        ilike(guest.nameOnInvitation, searchPattern)
      ),
      columns: {
        invitationId: true,
      },
    });

    const matchingInvitationIds = [
      ...new Set(matchingGuests.map((g) => g.invitationId).filter(Boolean)),
    ];

    const whereConditions = [eq(invitation.weddingId, wedding.id)];

    if (matchingInvitationIds.length > 0) {
      whereConditions.push(
        or(
          ilike(invitation.inviteGroupName, searchPattern),
          inArray(invitation.id, matchingInvitationIds as string[])
        )!
      );
    } else {
      whereConditions.push(ilike(invitation.inviteGroupName, searchPattern));
    }

    const results = await db.query.invitation.findMany({
      where: and(...whereConditions),
      with: {
        guests: true,
      },
      orderBy: () => {
        switch (sortBy) {
          case "alpha-desc":
            return [desc(invitation.inviteGroupName)];
          case "date-newest":
            return [desc(invitation.createdAt)];
          case "date-oldest":
            return [asc(invitation.createdAt)];
          case "updated-newest":
            return [desc(invitation.lastUpdatedAt)];
          case "alpha-asc":
          default:
            return [asc(invitation.inviteGroupName)];
        }
      },
    });

    const resultsWithAttendance = results.map((inv) => {
      let attending = 0;
      let total = 0;

      inv.guests.forEach((g) => {
        total++;
        if (g.isAttending) attending++;
        if (g.hasPlusOne) {
          total++;
          if (g.isAttending) attending++;
        }
      });

      return {
        ...inv,
        attending,
        total,
      };
    });

    return NextResponse.json({
      results: resultsWithAttendance,
      count: resultsWithAttendance.length,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error searching invitations:", error);
    return NextResponse.json(
      { error: "Failed to search invitations" },
      { status: 500 }
    );
  }
}

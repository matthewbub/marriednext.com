import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { invitation } from "@/drizzle/schema";
import { and, or, eq, ilike, asc, desc, sql } from "drizzle-orm";
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

    const results = await db.query.invitation.findMany({
      where: and(
        eq(invitation.weddingId, wedding.id),
        or(
          ilike(invitation.guestA, searchPattern),
          ilike(invitation.guestB, searchPattern),
          ilike(invitation.inviteGroupName, searchPattern)
        )
      ),
      with: {
        guest_guestA: true,
        guest_guestB: true,
        guest_guestC: true,
        guest_guestD: true,
        guest_guestE: true,
        guest_guestF: true,
        guest_guestG: true,
        guest_guestH: true,
      },
      orderBy: () => {
        switch (sortBy) {
          case "alpha-desc":
            return [
              desc(
                sql`COALESCE(${invitation.inviteGroupName}, ${invitation.guestA})`
              ),
            ];
          case "date-newest":
            return [desc(invitation.createdAt)];
          case "date-oldest":
            return [asc(invitation.createdAt)];
          case "updated-newest":
            return [desc(invitation.lastUpdatedAt)];
          case "alpha-asc":
          default:
            return [
              asc(
                sql`COALESCE(${invitation.inviteGroupName}, ${invitation.guestA})`
              ),
            ];
        }
      },
    });

    const resultsWithAttendance = results.map((inv) => {
      let attending = 0;
      let total = 0;

      const allGuests = [
        inv.guest_guestA,
        inv.guest_guestB,
        inv.guest_guestC,
        inv.guest_guestD,
        inv.guest_guestE,
        inv.guest_guestF,
        inv.guest_guestG,
        inv.guest_guestH,
      ];

      allGuests.forEach((g) => {
        if (g) {
          total++;
          if (g.isAttending) attending++;
          if (g.hasPlusOne) {
            total++;
            if (g.isAttending) attending++;
          }
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

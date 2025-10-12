import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { invitationGroups } from "@/drizzle/schema";
import { or, ilike, asc, desc, sql } from "drizzle-orm";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1),
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
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

    const results = await db.query.invitationGroups.findMany({
      where: or(
        ilike(invitationGroups.guestA, searchPattern),
        ilike(invitationGroups.guestB, searchPattern),
        ilike(invitationGroups.inviteGroupName, searchPattern)
      ),
      with: {
        invitation_guestA: true,
        invitation_guestB: true,
        invitation_guestC: true,
        invitation_guestD: true,
        invitation_guestE: true,
        invitation_guestF: true,
        invitation_guestG: true,
        invitation_guestH: true,
      },
      orderBy: () => {
        switch (sortBy) {
          case "alpha-desc":
            return [
              desc(
                sql`COALESCE(${invitationGroups.inviteGroupName}, ${invitationGroups.guestA})`
              ),
            ];
          case "date-newest":
            return [desc(invitationGroups.createdAt)];
          case "date-oldest":
            return [asc(invitationGroups.createdAt)];
          case "updated-newest":
            return [desc(invitationGroups.lastUpdatedAt)];
          case "alpha-asc":
          default:
            return [
              asc(
                sql`COALESCE(${invitationGroups.inviteGroupName}, ${invitationGroups.guestA})`
              ),
            ];
        }
      },
    });

    const resultsWithAttendance = results.map((group) => {
      let attending = 0;
      let total = 0;

      const allGuests = [
        group.invitation_guestA,
        group.invitation_guestB,
        group.invitation_guestC,
        group.invitation_guestD,
        group.invitation_guestE,
        group.invitation_guestF,
        group.invitation_guestG,
        group.invitation_guestH,
      ];

      allGuests.forEach((guest) => {
        if (guest) {
          total++;
          if (guest.isAttending) attending++;
          if (guest.hasPlusOne) {
            total++;
            if (guest.isAttending) attending++;
          }
        }
      });

      return {
        ...group,
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

    console.error("Error searching guest list:", error);
    return NextResponse.json(
      { error: "Failed to search guest list" },
      { status: 500 }
    );
  }
}

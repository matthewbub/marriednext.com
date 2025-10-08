import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { invitationGroups } from "@/drizzle/schema";
import { or, ilike } from "drizzle-orm";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1),
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

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
      },
    });

    const resultsWithAttendance = results.map((group) => {
      let attending = 0;
      let total = 0;

      if (group.invitation_guestA) {
        total++;
        if (group.invitation_guestA.isAttending) attending++;
        if (group.invitation_guestA.hasPlusOne) {
          total++;
          if (group.invitation_guestA.isAttending) attending++;
        }
      }

      if (group.invitation_guestB) {
        total++;
        if (group.invitation_guestB.isAttending) attending++;
        if (group.invitation_guestB.hasPlusOne) {
          total++;
          if (group.invitation_guestB.isAttending) attending++;
        }
      }

      return {
        ...group,
        attending,
        total,
      };
    });

    const sortedResults = resultsWithAttendance.sort((a, b) => {
      const aMatchesGuestA = a.guestA
        .toLowerCase()
        .includes(validatedData.query.toLowerCase());
      const bMatchesGuestA = b.guestA
        .toLowerCase()
        .includes(validatedData.query.toLowerCase());

      if (aMatchesGuestA && !bMatchesGuestA) return -1;
      if (!aMatchesGuestA && bMatchesGuestA) return 1;

      const aMatchesGuestB = a.guestB
        ?.toLowerCase()
        .includes(validatedData.query.toLowerCase());
      const bMatchesGuestB = b.guestB
        ?.toLowerCase()
        .includes(validatedData.query.toLowerCase());

      if (aMatchesGuestB && !bMatchesGuestB) return -1;
      if (!aMatchesGuestB && bMatchesGuestB) return 1;

      return 0;
    });

    return NextResponse.json({
      results: sortedResults,
      count: sortedResults.length,
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

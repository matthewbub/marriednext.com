import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db, getInvitationsWithGuests } from "@/database/drizzle";
import { getCurrentWedding } from "@/lib/wedding/getCurrentWedding";
import { buildSiteUrl, getInitials } from "@/lib/utils/site";
import { z } from "zod";
import { guest, invitation } from "orm-shelf/schema";
import { and, eq, inArray } from "drizzle-orm";

type GuestResponse = {
  id: string;
  name: string;
  isAttending: boolean | null;
  hasPlusOne: boolean;
};

type InvitationResponse = {
  id: string;
  groupName: string;
  email: string | null;
  guests: GuestResponse[];
};

export async function GET() {
  try {
    const [user, weddingData] = await Promise.all([
      currentUser(),
      getCurrentWedding(),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!weddingData) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const invitationsWithGuests = await getInvitationsWithGuests(
      weddingData.id,
      "alpha-asc"
    );

    const invitations: InvitationResponse[] = invitationsWithGuests.map(
      (inv) => ({
        id: inv.id,
        groupName:
          inv.inviteGroupName || inv.guests[0]?.nameOnInvitation || "Unnamed",
        email: inv.email,
        guests: inv.guests.map((g) => ({
          id: g.id,
          name: g.nameOnInvitation,
          isAttending: g.isAttending,
          hasPlusOne: g.hasPlusOne ?? false,
        })),
      })
    );

    let guestCount = 0;
    let plusOneCount = 0;
    let attendingGuests = 0;
    let declinedGuests = 0;

    for (const inv of invitationsWithGuests) {
      for (const g of inv.guests) {
        guestCount++;
        if (g.hasPlusOne) plusOneCount++;
        if (g.isAttending === true) attendingGuests++;
        if (g.isAttending === false) declinedGuests++;
      }
    }

    const totalGuests = guestCount + plusOneCount;
    const pendingGuests = totalGuests - attendingGuests - declinedGuests;
    const totalInvitations = invitations.length;

    const subscriptionPlan = "Free";
    const rsvpLink = weddingData.subdomain
      ? `${weddingData.subdomain}.marriednext.com/rsvp`
      : "";

    return NextResponse.json({
      invitations,
      stats: {
        totalGuests,
        attendingGuests,
        declinedGuests,
        pendingGuests,
        totalInvitations,
      },
      rsvpLink,
      rsvpLookupMethod: weddingData.controlRsvpNameFormat || "FULL_NAME",
      user: {
        fullName:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "User",
        imageUrl: user.imageUrl || null,
        initials: getInitials(user.fullName, user.firstName, user.lastName),
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      wedding: {
        displayName: weddingData.fieldDisplayName || "",
        nameA: weddingData.fieldNameA || "",
        nameB: weddingData.fieldNameB || "",
        eventDate: weddingData.fieldEventDate || null,
      },
      subscriptionPlan,
    });
  } catch (error) {
    console.error("Error fetching guest list:", error);
    return NextResponse.json(
      { error: "Failed to fetch guest list" },
      { status: 500 }
    );
  }
}

const addGuestSchema = z.object({
  guests: z
    .array(z.string().min(1, "Guest name cannot be empty"))
    .min(1, "At least one guest is required")
    .max(8, "Maximum of 8 guests per invitation"),
  hasPlusOne: z.boolean().default(false),
  inviteGroupName: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weddingData = await getCurrentWedding();
    if (!weddingData) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = addGuestSchema.parse(body);

    const { guests, hasPlusOne, inviteGroupName, email } = validatedData;

    const existingGuests = await db
      .select()
      .from(guest)
      .where(
        and(
          eq(guest.weddingId, weddingData.id),
          inArray(guest.nameOnInvitation, guests)
        )
      );

    if (existingGuests.length > 0) {
      const duplicateNames = existingGuests
        .map((g) => g.nameOnInvitation)
        .join(", ");
      return NextResponse.json(
        {
          error: `Guest name(s) already exist: ${duplicateNames}`,
        },
        { status: 409 }
      );
    }

    const result = await db.transaction(async (tx) => {
      const [createdInvitation] = await tx
        .insert(invitation)
        .values({
          weddingId: weddingData.id,
          inviteGroupName: inviteGroupName || null,
          email: email || null,
        })
        .returning();

      const createdGuests = [];
      for (const guestName of guests) {
        const [createdGuest] = await tx
          .insert(guest)
          .values({
            weddingId: weddingData.id,
            invitationId: createdInvitation.id,
            nameOnInvitation: guestName,
            hasPlusOne: guests.length === 1 ? hasPlusOne : false,
            isAttending: null,
          })
          .returning();
        createdGuests.push(createdGuest);
      }

      return {
        invitation: createdInvitation,
        guests: createdGuests,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error processing add guest request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

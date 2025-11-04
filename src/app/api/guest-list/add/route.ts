import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { guest, invitation } from "@/drizzle/schema";
import { and, eq, inArray } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { extractWeddingId } from "@/lib/extractWeddingId";

const addGuestSchema = z.object({
  guests: z
    .array(z.string().min(1, "Guest name cannot be empty"))
    .min(1, "At least one guest is required")
    .max(8, "Maximum of 8 guests per invitation"),
  hasPlusOne: z.boolean().default(false),
  inviteGroupName: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const weddingId = extractWeddingId(sessionClaims as CustomJwtSessionClaims);

    if (!userId || !weddingId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = addGuestSchema.parse(body);

    const { guests, hasPlusOne, inviteGroupName } = validatedData;

    const existingGuests = await db
      .select()
      .from(guest)
      .where(
        and(
          eq(guest.weddingId, weddingId),
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
          weddingId: weddingId,
          inviteGroupName: inviteGroupName || null,
        })
        .returning();

      const createdGuests = [];
      for (const guestName of guests) {
        const [createdGuest] = await tx
          .insert(guest)
          .values({
            weddingId: weddingId,
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

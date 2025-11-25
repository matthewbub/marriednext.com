import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { guest, invitation } from "orm-shelf/schema";
import { eq } from "drizzle-orm";
import { getWeddingFromRequest } from "@/lib/tenant/getWeddingFromRequest";

const guestSelectionSchema = z.object({
  name: z.string(),
  isAttending: z.boolean(),
});

const schema = z.object({
  invitationId: z.uuid(),
  email: z.email("Valid email is required"),
  guests: z
    .array(guestSelectionSchema)
    .min(1, "At least one guest is required"),
});

export async function POST(request: Request) {
  try {
    const wedding = await getWeddingFromRequest(request);

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const body = await request.json();
    const parse = schema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parse.error.issues },
        { status: 400 }
      );
    }

    const { invitationId, email, guests: guestSelections } = parse.data;

    const invitationRecord = await db.query.invitation.findFirst({
      where: eq(invitation.id, invitationId),
      with: {
        guests: true,
      },
    });

    if (!invitationRecord) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitationRecord.weddingId !== wedding.id) {
      return NextResponse.json(
        { error: "Invitation does not belong to this wedding" },
        { status: 403 }
      );
    }

    const guestMap = new Map(
      invitationRecord.guests.map((g) => [g.nameOnInvitation, g])
    );

    for (const guestSelection of guestSelections) {
      const guestRecord = guestMap.get(guestSelection.name);
      if (!guestRecord) {
        return NextResponse.json(
          { error: `Guest "${guestSelection.name}" not found in invitation` },
          { status: 400 }
        );
      }
    }

    await db.transaction(async (tx) => {
      await tx
        .update(invitation)
        .set({
          email,
          lastUpdatedAt: new Date().toISOString(),
        })
        .where(eq(invitation.id, invitationId));

      for (const guestSelection of guestSelections) {
        const guestRecord = guestMap.get(guestSelection.name);
        if (guestRecord) {
          await tx
            .update(guest)
            .set({
              isAttending: guestSelection.isAttending,
              dateEntrySubmitted: new Date().toISOString(),
            })
            .where(eq(guest.id, guestRecord.id));
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "RSVP submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}

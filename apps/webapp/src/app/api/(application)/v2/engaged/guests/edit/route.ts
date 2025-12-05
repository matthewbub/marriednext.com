import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";
import { z } from "zod";
import { guest, invitation } from "orm-shelf/schema";
import { and, eq } from "drizzle-orm";

const editGuestSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Guest name cannot be empty"),
  isAttending: z.boolean().nullable(),
  hasPlusOne: z.boolean(),
});

const editInvitationSchema = z.object({
  invitationId: z.string().uuid(),
  groupName: z.string().min(1, "Group name is required"),
  email: z
    .union([z.string().email("Invalid email"), z.literal(""), z.null()])
    .optional(),
  guests: z
    .array(editGuestSchema)
    .min(1, "At least one guest is required")
    .max(8, "Maximum of 8 guests per invitation"),
});

export async function PUT(request: Request) {
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
    const validatedData = editInvitationSchema.parse(body);

    const existingInvitation = await db.query.invitation.findFirst({
      where: and(
        eq(invitation.id, validatedData.invitationId),
        eq(invitation.weddingId, weddingData.id)
      ),
      with: {
        guests: true,
      },
    });

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .update(invitation)
        .set({
          inviteGroupName: validatedData.groupName,
          email: validatedData.email || null,
          lastUpdatedAt: new Date().toISOString(),
        })
        .where(eq(invitation.id, validatedData.invitationId));

      const existingGuestIds = new Set(
        existingInvitation.guests.map((g) => g.id)
      );
      const incomingGuestIds = new Set(
        validatedData.guests
          .filter((g) => !g.id.startsWith("new-"))
          .map((g) => g.id)
      );

      const guestsToDelete = existingInvitation.guests.filter(
        (g) => !incomingGuestIds.has(g.id)
      );

      for (const guestToDelete of guestsToDelete) {
        await tx.delete(guest).where(eq(guest.id, guestToDelete.id));
      }

      for (const guestData of validatedData.guests) {
        if (guestData.id.startsWith("new-")) {
          await tx.insert(guest).values({
            weddingId: weddingData.id,
            invitationId: validatedData.invitationId,
            nameOnInvitation: guestData.name,
            isAttending: guestData.isAttending,
            hasPlusOne: guestData.hasPlusOne,
          });
        } else if (existingGuestIds.has(guestData.id)) {
          await tx
            .update(guest)
            .set({
              nameOnInvitation: guestData.name,
              isAttending: guestData.isAttending,
              hasPlusOne: guestData.hasPlusOne,
            })
            .where(eq(guest.id, guestData.id));
        }
      }

      return { success: true };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error editing invitation:", error);
    return NextResponse.json(
      { error: "Failed to edit invitation" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { invitations, invitationGroups } from "@/drizzle/schema";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

const deleteGuestSchema = z.object({
  entryId: z.number(),
});

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = deleteGuestSchema.parse(body);

    const existingGroup = await db.query.invitationGroups.findFirst({
      where: eq(invitationGroups.id, validatedData.entryId),
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Invitation group not found" },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      const guestNames: string[] = [
        existingGroup.guestA,
        existingGroup.guestB,
        existingGroup.guestC,
        existingGroup.guestD,
        existingGroup.guestE,
        existingGroup.guestF,
        existingGroup.guestG,
        existingGroup.guestH,
      ].filter((name): name is string => name !== null);

      if (guestNames.length > 0) {
        await tx
          .delete(invitations)
          .where(inArray(invitations.nameOnInvitation, guestNames));
      }

      await tx
        .delete(invitationGroups)
        .where(eq(invitationGroups.id, validatedData.entryId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error deleting guest:", error);
    return NextResponse.json(
      { error: "Failed to delete guest" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";
import { z } from "zod";
import { guest, invitation } from "orm-shelf/schema";
import { and, eq } from "drizzle-orm";

const deleteInvitationSchema = z.object({
  invitationId: z.string().uuid(),
});

export async function DELETE(request: Request) {
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
    const validatedData = deleteInvitationSchema.parse(body);

    const existingInvitation = await db.query.invitation.findFirst({
      where: and(
        eq(invitation.id, validatedData.invitationId),
        eq(invitation.weddingId, weddingData.id)
      ),
    });

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .delete(guest)
        .where(eq(guest.invitationId, validatedData.invitationId));

      await tx
        .delete(invitation)
        .where(eq(invitation.id, validatedData.invitationId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { error: "Failed to delete invitation" },
      { status: 500 }
    );
  }
}


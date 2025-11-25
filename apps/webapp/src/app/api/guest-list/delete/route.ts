import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { invitation } from "orm-shelf/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { extractWeddingId } from "@/lib/extractWeddingId";

const deleteInvitationSchema = z.object({
  entryId: z.string().uuid(),
});

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { userId, sessionClaims } = await auth();
    const weddingId = extractWeddingId(sessionClaims as CustomJwtSessionClaims);

    if (!userId || !weddingId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = deleteInvitationSchema.parse(body);

    const existingInvitation = await db.query.invitation.findFirst({
      where: and(
        eq(invitation.id, validatedData.entryId),
        eq(invitation.weddingId, weddingId)
      ),
    });

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    await db.delete(invitation).where(eq(invitation.id, validatedData.entryId));
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

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { collaboratorInvitations, weddingUsers } from "orm-shelf/schema";
import { eq, and } from "drizzle-orm";

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const weddingId = user.publicMetadata?.weddingId as string | undefined;
    const role = (user.publicMetadata?.role as string) || "spouse";
    console.log("weddingId", weddingId);
    console.log("role", role);

    if (!weddingId) {
      return NextResponse.json(
        { error: "No wedding association found in user metadata" },
        { status: 400 }
      );
    }

    const existingWeddingUser = await db.query.weddingUsers.findFirst({
      where: and(
        eq(weddingUsers.weddingId, weddingId),
        eq(weddingUsers.clerkUserId, user.id)
      ),
    });

    if (existingWeddingUser) {
      return NextResponse.json({
        success: true,
        message: "User already associated with wedding",
      });
    }

    await db.insert(weddingUsers).values({
      weddingId,
      clerkUserId: user.id,
      role: role as "spouse" | "family" | "planner",
    });

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (userEmail) {
      await db
        .update(collaboratorInvitations)
        .set({
          status: "accepted",
          respondedAt: new Date().toISOString(),
        })
        .where(
          and(
            eq(collaboratorInvitations.weddingId, weddingId),
            eq(collaboratorInvitations.invitedEmail, userEmail)
          )
        );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined wedding",
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    );
  }
}

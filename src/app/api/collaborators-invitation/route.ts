import { db } from "@/database/drizzle";
import { collaboratorInvitations } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const invitation = await db.query.collaboratorInvitations.findFirst({
    where: eq(collaboratorInvitations.id, (id as string) ?? ""),
  });

  if (!invitation || invitation.status !== "pending") {
    return NextResponse.json(
      { error: "Invitation no longer valid" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    id: invitation.id,
    senderEmail: invitation.invitedByName,
    role: invitation.role,
    invitedEmail: invitation.invitedEmail,
    message: invitation.message,
  });
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}

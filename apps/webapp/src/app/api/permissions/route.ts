import { UserRole } from "@/components/permissions/permissions.types";
import { db } from "@/database/drizzle";
import { collaboratorInvitations, weddingUsers } from "orm-shelf/schema";
import { extractWeddingId } from "@/lib/extractWeddingId";
import { formatDate } from "@/lib/utils";
import {
  auth,
  clerkClient,
  currentUser,
  Invitation,
} from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { sessionClaims } = await auth();
  const weddingId = extractWeddingId(sessionClaims as CustomJwtSessionClaims);
  if (!weddingId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerk = await clerkClient();

  const [invitations, allWeddingUsers, weddingUser] = await Promise.all([
    db.query.collaboratorInvitations.findMany({
      where: eq(collaboratorInvitations.weddingId, weddingId),
    }),
    db.query.weddingUsers.findMany({
      where: eq(weddingUsers.weddingId, weddingId),
    }),
    db.query.weddingUsers.findFirst({
      where: and(
        eq(weddingUsers.clerkUserId, user.id),
        eq(weddingUsers.weddingId, weddingId)
      ),
    }),
  ]);

  const otherWeddingUsers = allWeddingUsers.filter(
    (wu) => wu.clerkUserId !== user.id
  );

  const collaboratorsWithEmails = await Promise.all(
    otherWeddingUsers.map(async (weddingUser) => {
      const clerkUser = await clerk.users.getUser(weddingUser.clerkUserId);
      return {
        id: weddingUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        role: weddingUser.role as UserRole,
        createdAt: formatDate(weddingUser.createdAt),
      };
    })
  );

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status !== "accepted"
  );

  return NextResponse.json({
    currentUser: {
      email: user.emailAddresses[0]?.emailAddress || "",
      role: (weddingUser?.role as UserRole) || "spouse",
    },
    collaborators: collaboratorsWithEmails,
    invitations: pendingInvitations.map((invitation) => ({
      id: invitation.invitationId,
      email: invitation.invitedEmail,
      role: invitation.role as UserRole,
      status: invitation.status,
      sentAt: formatDate(invitation.sentAt),
    })),
  });
}

// Create a new collaborator invitation
//  This just sends a request to Clerk with metadata about the invitation
export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionClaims } = await auth();
  const weddingId = extractWeddingId(sessionClaims as CustomJwtSessionClaims);
  if (!weddingId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { email, role } = body;

  // Create a new collaborator invitation
  const clerk = await clerkClient();
  const invitation = await clerk.invitations.createInvitation({
    emailAddress: email,
    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`,
    ignoreExisting: true,
    // I don't think this data persists through the invitation flow
    // its not there when the user signs up, so we mirror it in the database (below)
    publicMetadata: {
      onboardingComplete: true,
      weddingId,
      role,
    },
  });

  // create a new collaborator invitation record in the database
  // this is just like a mirror more than anything
  // we will pull this info when pushing a user to the /onboarding page
  // so we can skip onboarding and directly associate the user with the wedding
  const [newInvitation] = await db
    .insert(collaboratorInvitations)
    .values({
      weddingId,
      invitationId: invitation.id,
      invitedEmail: email,
      invitedByName:
        user.fullName || user.emailAddresses[0]?.emailAddress || "Unknown",
      role,
      status: "pending",
    })
    .returning();

  return NextResponse.json({
    success: true,
    // data: invitation,
    // newInvitation: newInvitation,
  });
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { sessionClaims } = await auth();
  const weddingId = extractWeddingId(sessionClaims as CustomJwtSessionClaims);
  if (!weddingId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { invitationId, collaboratorId } = body;

  if (collaboratorId) {
    await db
      .delete(weddingUsers)
      .where(
        and(
          eq(weddingUsers.id, collaboratorId),
          eq(weddingUsers.weddingId, weddingId)
        )
      );
    return NextResponse.json({
      success: true,
      message: "Collaborator removed.",
    });
  }

  if (!invitationId) {
    return NextResponse.json(
      { error: "Invitation ID or Collaborator ID is required" },
      { status: 400 }
    );
  }

  const invitationResponse = await fetch(
    `https://api.clerk.com/v1/invitations/${invitationId}/revoke`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    }
  );
  const invitation = (await invitationResponse.json()) as Invitation;
  if (invitation.revoked || invitation.status === "revoked") {
    await db
      .delete(collaboratorInvitations)
      .where(eq(collaboratorInvitations.invitationId, invitationId));
    return NextResponse.json({ success: true, message: "Invitation revoked." });
  } else {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to revoke invitation. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionClaims } = await auth();
  const weddingId = extractWeddingId(sessionClaims as CustomJwtSessionClaims);
  if (!weddingId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { currentUser: currentUserUpdate, collaborators, invitations } = body;

  if (currentUserUpdate) {
    await db
      .update(weddingUsers)
      .set({ role: currentUserUpdate.role })
      .where(
        and(
          eq(weddingUsers.clerkUserId, user.id),
          eq(weddingUsers.weddingId, weddingId)
        )
      );
  }

  if (collaborators && Array.isArray(collaborators)) {
    for (const collaborator of collaborators) {
      await db
        .update(weddingUsers)
        .set({ role: collaborator.role })
        .where(
          and(
            eq(weddingUsers.id, collaborator.id),
            eq(weddingUsers.weddingId, weddingId)
          )
        );
    }
  }

  if (invitations && Array.isArray(invitations)) {
    for (const invitation of invitations) {
      await db
        .update(collaboratorInvitations)
        .set({ role: invitation.role })
        .where(
          and(
            eq(collaboratorInvitations.invitationId, invitation.id),
            eq(collaboratorInvitations.weddingId, weddingId)
          )
        );
    }
  }

  return NextResponse.json({
    success: true,
    message: "Permissions updated successfully",
  });
}

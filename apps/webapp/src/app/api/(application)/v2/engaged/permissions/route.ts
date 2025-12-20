import { NextResponse } from "next/server";
import { currentUser, clerkClient, Invitation } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { collaboratorInvitations, weddingUsers } from "orm-shelf/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/wedding/getCurrentWedding";
import { getInitials } from "@/lib/utils/site";
import { formatDate } from "@/lib/utils/date";
import { z } from "zod";

const componentRoleEnum = z.enum([
  "spouse",
  "family_member",
  "wedding_planner",
]);

const inviteCollaboratorSchema = z.object({
  email: z.string().email(),
  role: componentRoleEnum,
});

const deleteCollaboratorSchema = z.object({
  invitationId: z.string().optional(),
  collaboratorId: z.string().optional(),
});

const updateRolesSchema = z.object({
  currentUser: z.object({ role: componentRoleEnum }).optional(),
  collaborators: z
    .array(z.object({ id: z.string(), role: componentRoleEnum }))
    .optional(),
  invitations: z
    .array(z.object({ id: z.string(), role: componentRoleEnum }))
    .optional(),
});

function mapDatabaseRoleToComponentRole(
  dbRole: string
): "spouse" | "family_member" | "wedding_planner" {
  if (dbRole === "family") return "family_member";
  if (dbRole === "planner") return "wedding_planner";
  return "spouse";
}

function mapComponentRoleToDatabaseRole(
  componentRole: "spouse" | "family_member" | "wedding_planner"
): "spouse" | "family" | "planner" {
  if (componentRole === "family_member") return "family";
  if (componentRole === "wedding_planner") return "planner";
  return "spouse";
}

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

    const clerk = await clerkClient();

    const [invitations, allWeddingUsers, weddingUser] = await Promise.all([
      db.query.collaboratorInvitations.findMany({
        where: eq(collaboratorInvitations.weddingId, weddingData.id),
      }),
      db.query.weddingUsers.findMany({
        where: eq(weddingUsers.weddingId, weddingData.id),
      }),
      db.query.weddingUsers.findFirst({
        where: and(
          eq(weddingUsers.clerkUserId, user.id),
          eq(weddingUsers.weddingId, weddingData.id)
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
          role: mapDatabaseRoleToComponentRole(weddingUser.role),
          joinedAt: formatDate(weddingUser.createdAt),
        };
      })
    );

    const pendingInvitations = invitations.filter(
      (invitation) => invitation.status !== "accepted"
    );

    const subscriptionPlan = "Free";

    return NextResponse.json({
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
      currentUser: {
        email: user.emailAddresses[0]?.emailAddress || "",
        role: mapDatabaseRoleToComponentRole(weddingUser?.role || "spouse"),
      },
      collaborators: collaboratorsWithEmails,
      invitations: pendingInvitations.map((invitation) => ({
        id: invitation.invitationId,
        email: invitation.invitedEmail,
        role: mapDatabaseRoleToComponentRole(invitation.role),
        status: invitation.status,
        sentAt: formatDate(invitation.sentAt),
      })),
    });
  } catch (error) {
    console.error("Error fetching permissions data:", error);
    return NextResponse.json(
      { error: "Failed to fetch permissions data" },
      { status: 500 }
    );
  }
}

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
    const validatedData = inviteCollaboratorSchema.parse(body);
    const { email, role } = validatedData;
    const dbRole = mapComponentRoleToDatabaseRole(role);

    const clerk = await clerkClient();
    const invitation = await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invitation`,
      ignoreExisting: true,
      publicMetadata: {
        onboardingComplete: true,
        weddingId: weddingData.id,
        role: dbRole,
      },
    });

    await db.insert(collaboratorInvitations).values({
      weddingId: weddingData.id,
      invitationId: invitation.id,
      invitedEmail: email,
      invitedByName:
        user.fullName || user.emailAddresses[0]?.emailAddress || "Unknown",
      role: dbRole,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const weddingData = await getCurrentWedding();
    if (!weddingData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = deleteCollaboratorSchema.parse(body);
    const { invitationId, collaboratorId } = validatedData;

    if (collaboratorId) {
      await db
        .delete(weddingUsers)
        .where(
          and(
            eq(weddingUsers.id, collaboratorId),
            eq(weddingUsers.weddingId, weddingData.id)
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
      return NextResponse.json({
        success: true,
        message: "Invitation revoked.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to revoke invitation. Please try again.",
      },
      { status: 500 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error deleting collaborator/invitation:", error);
    return NextResponse.json(
      { error: "Failed to process delete request" },
      { status: 500 }
    );
  }
}

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
    const validatedData = updateRolesSchema.parse(body);
    const {
      currentUser: currentUserUpdate,
      collaborators,
      invitations,
    } = validatedData;

    if (currentUserUpdate) {
      const dbRole = mapComponentRoleToDatabaseRole(currentUserUpdate.role);
      await db
        .update(weddingUsers)
        .set({ role: dbRole })
        .where(
          and(
            eq(weddingUsers.clerkUserId, user.id),
            eq(weddingUsers.weddingId, weddingData.id)
          )
        );
    }

    if (collaborators && Array.isArray(collaborators)) {
      for (const collaborator of collaborators) {
        const dbRole = mapComponentRoleToDatabaseRole(collaborator.role);
        await db
          .update(weddingUsers)
          .set({ role: dbRole })
          .where(
            and(
              eq(weddingUsers.id, collaborator.id),
              eq(weddingUsers.weddingId, weddingData.id)
            )
          );
      }
    }

    if (invitations && Array.isArray(invitations)) {
      for (const invitation of invitations) {
        const dbRole = mapComponentRoleToDatabaseRole(invitation.role);
        await db
          .update(collaboratorInvitations)
          .set({ role: dbRole })
          .where(
            and(
              eq(collaboratorInvitations.invitationId, invitation.id),
              eq(collaboratorInvitations.weddingId, weddingData.id)
            )
          );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Permissions updated successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Error updating permissions:", error);
    return NextResponse.json(
      { error: "Failed to update permissions" },
      { status: 500 }
    );
  }
}

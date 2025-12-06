import { NextResponse } from "next/server";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { collaboratorInvitations, weddingUsers } from "orm-shelf/schema";
import { eq, and } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";
import { getInitials } from "@/lib/siteUtils";
import { formatDate } from "@/lib/utils";

function mapDatabaseRoleToComponentRole(
  dbRole: string
): "spouse" | "family_member" | "wedding_planner" {
  if (dbRole === "family") return "family_member";
  if (dbRole === "planner") return "wedding_planner";
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


import { NextResponse } from "next/server";
import {
  getGuestList,
  getGuestListWithGroups,
  type DbInvitation,
  type DbInvitationGroupWithGuests,
  db,
} from "@/database/drizzle";
import { invitations, invitationGroups } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const calculateAttendance = (entry: DbInvitationGroupWithGuests) => {
  let attending = 0;
  let total = 0;

  if (entry.invitation_guestA) {
    total++;
    if (entry.invitation_guestA.isAttending) attending++;
    if (entry.invitation_guestA.hasPlusOne) {
      total++;
      if (entry.invitation_guestA.isAttending) attending++;
    }
  }

  if (entry.invitation_guestB) {
    total++;
    if (entry.invitation_guestB.isAttending) attending++;
    if (entry.invitation_guestB.hasPlusOne) {
      total++;
      if (entry.invitation_guestB.isAttending) attending++;
    }
  }

  return { attending, total };
};

export async function GET(): Promise<
  NextResponse<{ guestList: DbInvitation[] }>
> {
  const guestList = await getGuestList();

  const guestListWithGroups = await getGuestListWithGroups();

  const guestListWithGroupsAndAttendance = guestListWithGroups.map((group) => {
    const { attending, total } = calculateAttendance(group);
    return {
      ...group,
      attending,
      total,
    };
  });

  const displayGuestListWithGroups = guestListWithGroups.map((group) => ({
    guestA: group.guestA,
    guestB: group.guestB
      ? "& " + group.guestB
      : guestList.find((guest) => guest.nameOnInvitation === group.guestA)
          ?.hasPlusOne
      ? "+ One"
      : null,
  }));

  const plusOneCount = guestList.filter((guest) => guest.hasPlusOne).length;

  return NextResponse.json({
    guestListWithGroups: guestListWithGroupsAndAttendance,
    guestList,
    guestListCount: guestList.length + plusOneCount,
    guestListWithGroupsCount: guestListWithGroups.length,
    displayGuestListWithGroups,
    plusOneCount,
  });
}

const updateGuestSchema = z.object({
  entryId: z.number(),
  guestA: z.string().min(1),
  guestAAttending: z.boolean().nullable(),
  guestAHasPlusOne: z.boolean(),
  guestB: z.string().nullable(),
  guestBAttending: z.boolean().nullable(),
  guestBHasPlusOne: z.boolean(),
  inviteGroupName: z.string().nullable(),
});

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateGuestSchema.parse(body);

    const existingGroup = await db.query.invitationGroups.findFirst({
      where: eq(invitationGroups.id, validatedData.entryId),
      with: {
        invitation_guestA: true,
        invitation_guestB: true,
      },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Invitation group not found" },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      if (existingGroup.invitation_guestA) {
        await tx
          .update(invitations)
          .set({
            nameOnInvitation: validatedData.guestA,
            isAttending: validatedData.guestAAttending,
            hasPlusOne: validatedData.guestAHasPlusOne,
          })
          .where(eq(invitations.id, existingGroup.invitation_guestA.id));
      }

      if (validatedData.guestB && existingGroup.invitation_guestB) {
        await tx
          .update(invitations)
          .set({
            nameOnInvitation: validatedData.guestB,
            isAttending: validatedData.guestBAttending,
            hasPlusOne: validatedData.guestBHasPlusOne,
          })
          .where(eq(invitations.id, existingGroup.invitation_guestB.id));
      } else if (!validatedData.guestB && existingGroup.invitation_guestB) {
        await tx
          .delete(invitations)
          .where(eq(invitations.id, existingGroup.invitation_guestB.id));
      }

      await tx
        .update(invitationGroups)
        .set({
          guestA: validatedData.guestA,
          guestB: validatedData.guestB,
          inviteGroupName: validatedData.inviteGroupName,
          lastUpdatedAt: new Date().toISOString(),
        })
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

    console.error("Error updating guest list:", error);
    return NextResponse.json(
      { error: "Failed to update guest list" },
      { status: 500 }
    );
  }
}

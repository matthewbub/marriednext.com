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

  const allGuests = [
    entry.invitation_guestA,
    entry.invitation_guestB,
    entry.invitation_guestC,
    entry.invitation_guestD,
    entry.invitation_guestE,
    entry.invitation_guestF,
    entry.invitation_guestG,
    entry.invitation_guestH,
  ];

  allGuests.forEach((guest) => {
    if (guest) {
      total++;
      if (guest.isAttending) attending++;
      if (guest.hasPlusOne) {
        total++;
        if (guest.isAttending) attending++;
      }
    }
  });

  return { attending, total };
};

export async function GET(
  request: Request
): Promise<NextResponse<{ guestList: DbInvitation[] }>> {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "alpha-asc";

  const guestList = await getGuestList();

  const guestListWithGroups = await getGuestListWithGroups(sortBy);

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
  guestC: z.string().nullable(),
  guestCAttending: z.boolean().nullable(),
  guestCHasPlusOne: z.boolean(),
  guestD: z.string().nullable(),
  guestDAttending: z.boolean().nullable(),
  guestDHasPlusOne: z.boolean(),
  guestE: z.string().nullable(),
  guestEAttending: z.boolean().nullable(),
  guestEHasPlusOne: z.boolean(),
  guestF: z.string().nullable(),
  guestFAttending: z.boolean().nullable(),
  guestFHasPlusOne: z.boolean(),
  guestG: z.string().nullable(),
  guestGAttending: z.boolean().nullable(),
  guestGHasPlusOne: z.boolean(),
  guestH: z.string().nullable(),
  guestHAttending: z.boolean().nullable(),
  guestHHasPlusOne: z.boolean(),
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
        invitation_guestC: true,
        invitation_guestD: true,
        invitation_guestE: true,
        invitation_guestF: true,
        invitation_guestG: true,
        invitation_guestH: true,
      },
    });

    if (!existingGroup) {
      return NextResponse.json(
        { error: "Invitation group not found" },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      const guestKeys = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

      for (const key of guestKeys) {
        const guestName = validatedData[
          `guest${key}` as keyof typeof validatedData
        ] as string | null;
        const guestAttending = validatedData[
          `guest${key}Attending` as keyof typeof validatedData
        ] as boolean | null;
        const guestHasPlusOne = validatedData[
          `guest${key}HasPlusOne` as keyof typeof validatedData
        ] as boolean;
        const existingInvitation = existingGroup[
          `invitation_guest${key}` as keyof typeof existingGroup
        ] as typeof existingGroup.invitation_guestA;

        if (guestName && existingInvitation) {
          await tx
            .update(invitations)
            .set({
              nameOnInvitation: guestName,
              isAttending: guestAttending,
              hasPlusOne: guestHasPlusOne,
            })
            .where(eq(invitations.id, existingInvitation.id));
        } else if (!guestName && existingInvitation) {
          await tx
            .delete(invitations)
            .where(eq(invitations.id, existingInvitation.id));
        }
      }

      await tx
        .update(invitationGroups)
        .set({
          guestA: validatedData.guestA,
          guestB: validatedData.guestB,
          guestC: validatedData.guestC,
          guestD: validatedData.guestD,
          guestE: validatedData.guestE,
          guestF: validatedData.guestF,
          guestG: validatedData.guestG,
          guestH: validatedData.guestH,
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

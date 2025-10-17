import {
  getGuestList,
  getInvitationsWithGuests,
  getInvitationsCount,
  type DbGuest,
  type DbInvitationWithGuests,
} from "@/database/drizzle";

export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class InvalidParamsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidParamsError";
  }
}

const calculateAttendance = (entry: DbInvitationWithGuests) => {
  let attending = 0;
  let total = 0;

  const allGuests = [
    entry.guest_guestA,
    entry.guest_guestB,
    entry.guest_guestC,
    entry.guest_guestD,
    entry.guest_guestE,
    entry.guest_guestF,
    entry.guest_guestG,
    entry.guest_guestH,
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

export type GuestListResponse = {
  invitations: (DbInvitationWithGuests & {
    attending: number;
    total: number;
  })[];
  guestListWithGroups: (DbInvitationWithGuests & {
    attending: number;
    total: number;
  })[];
  guestList: DbGuest[];
  guestListCount: number;
  guestListWithGroupsCount: number;
  invitationsCount: number;
  displayInvitations: { guestA: string; guestB: string | null }[];
  plusOneCount: number;
  hasMore: boolean;
  currentOffset: number;
  currentLimit: number;
};

export type GuestListParams = {
  sortBy?: string;
  limit?: number;
  offset?: number;
};

export async function getGuestListData(
  params: GuestListParams = {}
): Promise<GuestListResponse> {
  try {
    const sortBy = params.sortBy || "alpha-asc";
    const limit = params.limit || 25;
    const offset = params.offset || 0;

    const guestList = await getGuestList();

    const invitationsWithGuests = await getInvitationsWithGuests(
      sortBy,
      limit,
      offset
    );

    const totalCount = await getInvitationsCount();

    const invitationsWithAttendance = invitationsWithGuests.map((inv) => {
      const { attending, total } = calculateAttendance(inv);
      return {
        ...inv,
        attending,
        total,
      };
    });

    const displayInvitations = invitationsWithGuests.map((inv) => ({
      guestA: inv.guestA,
      guestB: inv.guestB
        ? "& " + inv.guestB
        : guestList.find((g) => g.nameOnInvitation === inv.guestA)?.hasPlusOne
        ? "+ One"
        : null,
    }));

    const plusOneCount = guestList.filter((g) => g.hasPlusOne).length;

    return {
      invitations: invitationsWithAttendance,
      guestListWithGroups: invitationsWithAttendance,
      guestList,
      guestListCount: guestList.length + plusOneCount,
      guestListWithGroupsCount: totalCount,
      invitationsCount: totalCount,
      displayInvitations,
      plusOneCount,
      hasMore: offset + limit < totalCount,
      currentOffset: offset,
      currentLimit: limit,
    };
  } catch (error) {
    throw new DatabaseError("Failed to fetch guest list data", error);
  }
}

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

const calculateAttendance = (entry: DbInvitationWithGuests) => {
  let attending = 0;
  let total = 0;

  entry.guests.forEach((guest) => {
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
  displayInvitations: { primaryGuest: string; secondaryGuest: string | null }[];
  plusOneCount: number;
  hasMore: boolean;
  currentOffset: number;
  currentLimit: number;
};

export type GuestListParams = {
  weddingId: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
};

export async function getGuestListData(
  params: GuestListParams
): Promise<GuestListResponse> {
  try {
    const { weddingId } = params;
    const sortBy = params.sortBy || "alpha-asc";
    const limit = params.limit || 25;
    const offset = params.offset || 0;

    const guestList = await getGuestList(weddingId);

    const invitationsWithGuests = await getInvitationsWithGuests(
      weddingId,
      sortBy,
      limit,
      offset
    );

    const totalCount = await getInvitationsCount(weddingId);

    const invitationsWithAttendance = invitationsWithGuests.map((inv) => {
      const { attending, total } = calculateAttendance(inv);
      return {
        ...inv,
        attending,
        total,
      };
    });

    const displayInvitations = invitationsWithGuests.map((inv) => {
      const primaryGuest = inv.guests[0]?.nameOnInvitation || "";
      const secondaryGuest = inv.guests[1]
        ? "& " + inv.guests[1].nameOnInvitation
        : inv.guests[0]?.hasPlusOne
        ? "+ One"
        : null;
      return {
        primaryGuest,
        secondaryGuest,
      };
    });

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

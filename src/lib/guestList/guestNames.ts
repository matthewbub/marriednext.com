import {
  DbInvitationGroupWithGuests,
  DbInvitationGroup,
  DbGuest,
} from "@/database/drizzle";

export function extractGuestNames(
  entry: DbInvitationGroup | DbInvitationGroupWithGuests
): string[] {
  if ("guests" in entry && Array.isArray(entry.guests)) {
    return entry.guests.map((g: DbGuest) => g.nameOnInvitation).filter(Boolean);
  }
  return [];
}

export function getDefaultDisplayName(
  entry: DbInvitationGroup | DbInvitationGroupWithGuests
): string {
  const guestNames = extractGuestNames(entry);

  if (guestNames.length === 0) {
    return "";
  }

  if (guestNames.length === 1) {
    return guestNames[0];
  }

  if (guestNames.length === 2) {
    return `${guestNames[0]} & ${guestNames[1]}`;
  }

  return `${guestNames[0]} & ${guestNames.length - 1} others`;
}

export function getDisplayName(
  entry: DbInvitationGroup | DbInvitationGroupWithGuests
): string {
  if (entry.inviteGroupName) {
    return entry.inviteGroupName;
  }

  return getDefaultDisplayName(entry);
}

export function mapGuestFieldsToObject(guests: (string | null | undefined)[]): {
  guestA: string | null;
  guestB: string | null;
  guestC: string | null;
  guestD: string | null;
  guestE: string | null;
  guestF: string | null;
  guestG: string | null;
  guestH: string | null;
} {
  return {
    guestA: guests[0] ?? null,
    guestB: guests[1] ?? null,
    guestC: guests[2] ?? null,
    guestD: guests[3] ?? null,
    guestE: guests[4] ?? null,
    guestF: guests[5] ?? null,
    guestG: guests[6] ?? null,
    guestH: guests[7] ?? null,
  };
}

import { RsvpNameFormat } from "@/types/rsvp";

function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

export function matchGuestName(
  input: string,
  guestName: string,
  format: RsvpNameFormat
): boolean {
  const normalizedInput = normalizeString(input);
  const normalizedGuest = normalizeString(guestName);

  if (normalizedInput.length === 0 || normalizedGuest.length === 0) {
    return false;
  }

  if (format === "FULL_NAME") {
    return normalizedInput === normalizedGuest;
  }

  if (format === "FIRST_NAME_ONLY") {
    const inputFirstName = normalizedInput.split(" ")[0];
    const guestFirstName = normalizedGuest.split(" ")[0];
    return inputFirstName === guestFirstName;
  }

  return false;
}

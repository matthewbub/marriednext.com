import { GuestType } from "./types";

export type { GuestType };

export const guestList = [
  ["Ken", "Terri"],
  ["Jordan", "Harlie"],
  ["Letty"],
  ["Brandy"],
  ["Thomas"],
  ["Liam"],
  ["Alex"],
  // ["Enzo"],
  ["Ezequiel", "Shayna"],
  ["Javier"],
  ["Johnny", "Alyssa"],
  ["Daniel", "Daisy"],
  ["Hunter"],
  ["Zach"],
  ["Tyler", "PLUSONE"],
  ["Jessica", "PLUSONE"],
  ["Barbara", "PLUSONE"],
  ["Jim", "PLUSONE"],
  ["Evelynn", "PLUSONE"],
  ["Elia", "Ofe"],
  // ["Greg", "Frida"],
  ["John", "PLUSONE"],
  ["Kathleen", "PLUSONE"],
  ["Dulce", "PLUSONE"],
  ["Lisa"],
  ["Teri"],
  ["Sydney"],
  ["Taylor"],
  ["Josh", "Nicole"],
  ["Hannah", "Isaac"],
  ["David", "Vickie"],
  ["Ryan"],
  ["Lauren", "Cody"],
  ["Tim", "Denise"],
  ["Mike", "Judy"],
  ["Chuck", "Ricky"],
  ["Granny", "Poppy"],
];

function normalizeString(str: string): string {
  return str.trim().toLowerCase().replace(/\s+/g, " ");
}

function isValidMatch(input: string, guestName: string): boolean {
  const normalizedInput = normalizeString(input);
  const normalizedGuest = normalizeString(guestName);

  // Exact match
  if (normalizedInput === normalizedGuest) {
    return true;
  }

  // Split both into words
  const inputWords = normalizedInput.split(" ");
  const guestWords = normalizedGuest.split(" ");

  // Only allow matches that include the first name (first word)
  // This prevents last-name-only matches which would be ambiguous
  const firstGuestWord = guestWords[0];
  if (!inputWords.includes(firstGuestWord)) {
    return false;
  }

  // Check if input is a subset of guest words (word-level matching)
  // This allows "Ken" to match "Ken Bub" but not "Hunt" to match "Hunter"
  return inputWords.every((inputWord) =>
    guestWords.some((guestWord) => guestWord === inputWord)
  );
}

export function validateGuest(firstName: string): GuestType {
  const normalizedName = normalizeString(firstName);

  // Handle empty or whitespace-only input
  if (normalizedName.length === 0) {
    return "UNKNOWN";
  }

  for (const guestEntry of guestList) {
    const firstSlot = guestEntry[0];
    const secondSlot = guestEntry[1];

    // Valid formats: ["Name1", "Name2"] or ["Name", "PLUSONE"] or ["Name"]
    const matchesFirstSlot = isValidMatch(firstName, firstSlot);

    if (matchesFirstSlot) {
      if (secondSlot) {
        if (secondSlot === "PLUSONE") {
          return "GUEST_PLUSONE_INVITED";
        } else {
          return "GUEST_AND_KNOWN_PLUSONE";
        }
      } else {
        return "GUEST_ONLY";
      }
    }

    // Check if the entered name matches the second slot
    if (
      secondSlot &&
      secondSlot !== "PLUSONE" &&
      typeof secondSlot === "string"
    ) {
      if (isValidMatch(firstName, secondSlot)) {
        return "GUEST_AND_KNOWN_PLUSONE";
      }
    }
  }

  return "UNKNOWN";
}

export function getCompanionName(inputName: string): string | undefined {
  const name = inputName ?? "";
  for (const guestEntry of guestList) {
    const firstSlot = guestEntry[0];
    const secondSlot = guestEntry[1];

    if (isValidMatch(name, firstSlot)) {
      if (
        secondSlot &&
        secondSlot !== "PLUSONE" &&
        typeof secondSlot === "string"
      ) {
        return secondSlot;
      }
      return undefined;
    }

    if (
      secondSlot &&
      secondSlot !== "PLUSONE" &&
      typeof secondSlot === "string" &&
      isValidMatch(name, secondSlot)
    ) {
      return firstSlot;
    }
  }
  return undefined;
}

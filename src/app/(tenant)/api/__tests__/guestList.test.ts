import { describe, it, expect } from "vitest";
import { validateGuest, type GuestType } from "@/lib/tenant/guestList";

describe("validateGuest", () => {
  describe("GUEST_ONLY scenarios", () => {
    it("should return GUEST_ONLY for single guest entries", () => {
      // From the guest list: ["Hunter"], ["Zach"]
      expect(validateGuest("Hunter")).toBe("GUEST_ONLY");
      expect(validateGuest("Zach")).toBe("GUEST_ONLY");
      // Note: last-name-only inputs should be UNKNOWN for disambiguation
    });

    it("should be case insensitive", () => {
      expect(validateGuest("hunter")).toBe("GUEST_ONLY");
      expect(validateGuest("HUNTER")).toBe("GUEST_ONLY");
      expect(validateGuest("zach")).toBe("GUEST_ONLY");
    });

    it("should handle valid partial name matches", () => {
      expect(validateGuest("Hunter")).toBe("GUEST_ONLY"); // Full first name
      // Note: Last name only is no longer allowed for RSVP disambiguation
    });
  });

  describe("GUEST_PLUSONE_INVITED scenarios", () => {
    it("should return GUEST_PLUSONE_INVITED for guests with PLUSONE", () => {
      // From the guest list: ["Tyler", "PLUSONE"], ["Jessica", "PLUSONE"], etc.
      expect(validateGuest("Tyler")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Jessica")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Barbara")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Jim")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Evelynn")).toBe("GUEST_PLUSONE_INVITED");
    });

    it("should handle names with incomplete data (TODOs)", () => {
      expect(validateGuest("Kathleen")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Cheri")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Illiana")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Dulce")).toBe("GUEST_PLUSONE_INVITED");
    });
  });

  describe("GUEST_AND_KNOWN_PLUSONE scenarios", () => {
    it("should return GUEST_AND_KNOWN_PLUSONE for couples", () => {
      // From the guest list: ["Ken", "Terri"], ["Jordan", "Harlie"], etc.
      expect(validateGuest("Ken")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Terri")).toBe("GUEST_AND_KNOWN_PLUSONE");

      expect(validateGuest("Jordan")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Harlie")).toBe("GUEST_AND_KNOWN_PLUSONE");
    });

    // Deprecated alternative_names array format tests removed

    it("should handle families and groups", () => {
      // Various family groupings
      expect(validateGuest("Hannah")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Isaac")).toBe("GUEST_AND_KNOWN_PLUSONE");

      expect(validateGuest("David")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Vickie")).toBe("GUEST_AND_KNOWN_PLUSONE");
    });
  });

  describe("UNKNOWN scenarios", () => {
    it("should return UNKNOWN for names not on guest list", () => {
      expect(validateGuest("John Smith")).toBe("UNKNOWN");
      expect(validateGuest("Random Person")).toBe("UNKNOWN");
      expect(validateGuest("Not On List")).toBe("UNKNOWN");
      expect(validateGuest("Unknown Guest")).toBe("UNKNOWN");
    });

    it("should return UNKNOWN for empty or whitespace-only input", () => {
      expect(validateGuest("")).toBe("UNKNOWN");
      expect(validateGuest("   ")).toBe("UNKNOWN");
      expect(validateGuest("\t")).toBe("UNKNOWN");
      expect(validateGuest("\n")).toBe("UNKNOWN");
    });

    it("should return UNKNOWN for partial matches that are too vague", () => {
      // These might match multiple people or be too generic
      expect(validateGuest("a")).toBe("UNKNOWN");
      expect(validateGuest("e")).toBe("UNKNOWN");
    });

    it("should return UNKNOWN for invalid partial name matches", () => {
      // These are substrings but not complete words
      expect(validateGuest("Hunt")).toBe("UNKNOWN"); // Not same as "Hunter"
      expect(validateGuest("Zac")).toBe("UNKNOWN"); // Not same as "Zach"
      expect(validateGuest("Hun")).toBe("UNKNOWN"); // Not a complete word
      expect(validateGuest("unt")).toBe("UNKNOWN"); // Not a complete word
    });

    it("should return UNKNOWN for last name only (ambiguous RSVP)", () => {
      // Last names could match multiple people, so we require first name
      expect(validateGuest("Tate")).toBe("UNKNOWN"); // Could be any Tate
      expect(validateGuest("Bub")).toBe("UNKNOWN"); // Could be Ken, Jordan, Terri, Harlie, or Lisa
      expect(validateGuest("Stevenson")).toBe("UNKNOWN"); // Could be multiple Stevensons
      expect(validateGuest("Ehret")).toBe("UNKNOWN"); // Could be Tyler, Jessica, or Jim
      expect(validateGuest("Bellah")).toBe("UNKNOWN"); // Even if only one, still ambiguous
    });
  });

  describe("Edge cases and special scenarios", () => {
    it("should handle names with special characters and spacing", () => {
      expect(validateGuest("  Ken  ")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Ken   ")).toBe("GUEST_AND_KNOWN_PLUSONE");
    });

    it("should handle complex family entries", () => {
      // ["Chuck", "Ricky"], ["Granny", "Poppy"]
      expect(validateGuest("Chuck")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Ricky")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Granny")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Poppy")).toBe("GUEST_AND_KNOWN_PLUSONE");
    });

    it("should validate specific real-world examples from the guest list", () => {
      // Specific entries to validate our logic
      expect(validateGuest("Letty")).toBe("GUEST_ONLY");
      expect(validateGuest("Brandy")).toBe("GUEST_ONLY");
      expect(validateGuest("Ezequiel")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Shayna")).toBe("GUEST_AND_KNOWN_PLUSONE");

      expect(validateGuest("Greg")).toBe("GUEST_AND_KNOWN_PLUSONE");
      expect(validateGuest("Frida")).toBe("GUEST_AND_KNOWN_PLUSONE");

      expect(validateGuest("John")).toBe("GUEST_PLUSONE_INVITED");
      expect(validateGuest("Lisa")).toBe("GUEST_PLUSONE_INVITED");
    });
  });

  describe("First-name-required matching", () => {
    it("should require first name for valid matches", () => {
      // First names should match (complete words only)
      expect(validateGuest("Ken")).toBe("GUEST_AND_KNOWN_PLUSONE"); // matches "Ken Bub"
      expect(validateGuest("Hunter")).toBe("GUEST_ONLY"); // matches "Hunter Tate"
      expect(validateGuest("Terri")).toBe("GUEST_AND_KNOWN_PLUSONE"); // matches "Terri Bub"

      // Full names longer than list entries should be UNKNOWN
      expect(validateGuest("Ken Bub")).toBe("UNKNOWN");
      expect(validateGuest("Hunter Tate")).toBe("UNKNOWN");

      // Last names only should NOT work (ambiguous)
      expect(validateGuest("Bub")).toBe("UNKNOWN"); // Could be Ken, Jordan, Terri, Harlie, or Lisa
      expect(validateGuest("Tate")).toBe("UNKNOWN"); // Could be Hunter Tate

      // Partial words should not work
      expect(validateGuest("Ke")).toBe("UNKNOWN"); // "Ke" is not "Ken"
      expect(validateGuest("Hunt")).toBe("UNKNOWN"); // "Hunt" is not "Hunter"
    });
  });
});

describe("Type safety", () => {
  it("should return valid GuestType values", () => {
    const validTypes: GuestType[] = [
      "GUEST_PLUSONE_INVITED",
      "GUEST_ONLY",
      "GUEST_AND_KNOWN_PLUSONE",
      "UNKNOWN",
    ];

    // Test a few different inputs to ensure they return valid types
    const results = [
      validateGuest("Ken"),
      validateGuest("Hunter"),
      validateGuest("Tyler Ehret"),
      validateGuest("Not Real Person"),
    ];

    results.forEach((result) => {
      expect(validTypes).toContain(result);
    });
  });
});

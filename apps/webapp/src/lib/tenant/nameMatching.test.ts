import { describe, it, expect } from "vitest";
import { matchGuestName } from "./nameMatching";

describe("matchGuestName", () => {
  describe("FULL_NAME mode", () => {
    it("should match exact full names", () => {
      expect(matchGuestName("John Doe", "John Doe", "FULL_NAME")).toBe(true);
    });

    it("should match with different casing", () => {
      expect(matchGuestName("john doe", "John Doe", "FULL_NAME")).toBe(true);
      expect(matchGuestName("JOHN DOE", "John Doe", "FULL_NAME")).toBe(true);
      expect(matchGuestName("JoHn DoE", "John Doe", "FULL_NAME")).toBe(true);
    });

    it("should match with extra whitespace", () => {
      expect(matchGuestName("  John Doe  ", "John Doe", "FULL_NAME")).toBe(
        true
      );
      expect(matchGuestName("John  Doe", "John Doe", "FULL_NAME")).toBe(true);
      expect(matchGuestName("John   Doe", "John Doe", "FULL_NAME")).toBe(true);
    });

    it("should not match partial names", () => {
      expect(matchGuestName("John", "John Doe", "FULL_NAME")).toBe(false);
      expect(matchGuestName("Doe", "John Doe", "FULL_NAME")).toBe(false);
    });

    it("should not match different names", () => {
      expect(matchGuestName("Jane Doe", "John Doe", "FULL_NAME")).toBe(false);
      expect(matchGuestName("John Smith", "John Doe", "FULL_NAME")).toBe(false);
    });

    it("should match names with middle names", () => {
      expect(
        matchGuestName("John Michael Doe", "John Michael Doe", "FULL_NAME")
      ).toBe(true);
      expect(
        matchGuestName("john michael doe", "John Michael Doe", "FULL_NAME")
      ).toBe(true);
    });

    it("should not match if middle name is missing", () => {
      expect(matchGuestName("John Doe", "John Michael Doe", "FULL_NAME")).toBe(
        false
      );
      expect(matchGuestName("John Michael Doe", "John Doe", "FULL_NAME")).toBe(
        false
      );
    });

    it("should handle empty strings", () => {
      expect(matchGuestName("", "John Doe", "FULL_NAME")).toBe(false);
      expect(matchGuestName("John Doe", "", "FULL_NAME")).toBe(false);
      expect(matchGuestName("", "", "FULL_NAME")).toBe(false);
    });

    it("should handle whitespace-only strings", () => {
      expect(matchGuestName("   ", "John Doe", "FULL_NAME")).toBe(false);
      expect(matchGuestName("John Doe", "   ", "FULL_NAME")).toBe(false);
    });
  });

  describe("FIRST_NAME_ONLY mode", () => {
    it("should match by first name only", () => {
      expect(matchGuestName("John", "John Doe", "FIRST_NAME_ONLY")).toBe(true);
      expect(matchGuestName("John", "John Smith", "FIRST_NAME_ONLY")).toBe(
        true
      );
    });

    it("should match with different casing", () => {
      expect(matchGuestName("john", "John Doe", "FIRST_NAME_ONLY")).toBe(true);
      expect(matchGuestName("JOHN", "John Doe", "FIRST_NAME_ONLY")).toBe(true);
    });

    it("should match with extra whitespace", () => {
      expect(matchGuestName("  John  ", "John Doe", "FIRST_NAME_ONLY")).toBe(
        true
      );
    });

    it("should match when full name is provided", () => {
      expect(matchGuestName("John Doe", "John Doe", "FIRST_NAME_ONLY")).toBe(
        true
      );
      expect(matchGuestName("John Smith", "John Doe", "FIRST_NAME_ONLY")).toBe(
        true
      );
    });

    it("should not match last name only", () => {
      expect(matchGuestName("Doe", "John Doe", "FIRST_NAME_ONLY")).toBe(false);
      expect(matchGuestName("Smith", "John Doe", "FIRST_NAME_ONLY")).toBe(
        false
      );
    });

    it("should not match different first names", () => {
      expect(matchGuestName("Jane", "John Doe", "FIRST_NAME_ONLY")).toBe(false);
      expect(matchGuestName("Jack", "John Doe", "FIRST_NAME_ONLY")).toBe(false);
    });

    it("should handle single-word names", () => {
      expect(matchGuestName("John", "John", "FIRST_NAME_ONLY")).toBe(true);
      expect(matchGuestName("john", "John", "FIRST_NAME_ONLY")).toBe(true);
    });

    it("should handle empty strings", () => {
      expect(matchGuestName("", "John Doe", "FIRST_NAME_ONLY")).toBe(false);
      expect(matchGuestName("John", "", "FIRST_NAME_ONLY")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle names with special characters", () => {
      expect(matchGuestName("O'Brien", "O'Brien", "FULL_NAME")).toBe(true);
      expect(matchGuestName("Jean-Claude", "Jean-Claude", "FULL_NAME")).toBe(
        true
      );
    });

    it("should handle names with multiple spaces between words", () => {
      expect(matchGuestName("John    Doe", "John Doe", "FULL_NAME")).toBe(true);
      expect(matchGuestName("John", "John    Doe", "FIRST_NAME_ONLY")).toBe(
        true
      );
    });

    it("should handle very long names", () => {
      const longName = "John Michael Patrick James Alexander Doe";
      expect(matchGuestName(longName, longName, "FULL_NAME")).toBe(true);
      expect(matchGuestName("John", longName, "FIRST_NAME_ONLY")).toBe(true);
    });
  });
});

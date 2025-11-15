import { describe, it, expect, vi, beforeEach } from "vitest";
import { findInvitationByGuestName } from "./invitationLookup";
import * as drizzle from "@/database/drizzle";

vi.mock("@/database/drizzle", () => ({
  db: {
    query: {
      invitation: {
        findMany: vi.fn(),
      },
    },
  },
  DbInvitationWithGuests: {},
}));

describe("findInvitationByGuestName", () => {
  const mockWeddingId = "wedding-123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockInvitation = (guests: (string | null)[]) => ({
    id: "inv-1",
    weddingId: mockWeddingId,
    guestA: guests[0] || null,
    guestB: guests[1] || null,
    guestC: guests[2] || null,
    guestD: guests[3] || null,
    guestE: guests[4] || null,
    guestF: guests[5] || null,
    guestG: guests[6] || null,
    guestH: guests[7] || null,
    createdAt: "2024-01-01",
    lastUpdatedAt: "2024-01-01",
    inviteGroupName: null,
    email: null,
    guest_guestA: guests[0] ? { nameOnInvitation: guests[0] } : null,
    guest_guestB: guests[1] ? { nameOnInvitation: guests[1] } : null,
    guest_guestC: guests[2] ? { nameOnInvitation: guests[2] } : null,
    guest_guestD: guests[3] ? { nameOnInvitation: guests[3] } : null,
    guest_guestE: guests[4] ? { nameOnInvitation: guests[4] } : null,
    guest_guestF: guests[5] ? { nameOnInvitation: guests[5] } : null,
    guest_guestG: guests[6] ? { nameOnInvitation: guests[6] } : null,
    guest_guestH: guests[7] ? { nameOnInvitation: guests[7] } : null,
  });

  it("should find invitation by full name in FULL_NAME mode", async () => {
    const mockInvitations = [createMockInvitation(["John Doe", "Jane Doe"])];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "John Doe",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toEqual(mockInvitations[0]);
  });

  it("should find invitation by first name in FIRST_NAME_ONLY mode", async () => {
    const mockInvitations = [createMockInvitation(["John Doe", "Jane Smith"])];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "John",
      mockWeddingId,
      "FIRST_NAME_ONLY"
    );

    expect(result).toEqual(mockInvitations[0]);
  });

  it("should return null if no match found", async () => {
    const mockInvitations = [createMockInvitation(["John Doe", "Jane Doe"])];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "Bob Smith",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toBeNull();
  });

  it("should handle case-insensitive matching", async () => {
    const mockInvitations = [createMockInvitation(["John Doe"])];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "john doe",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toEqual(mockInvitations[0]);
  });

  it("should search through multiple guest slots", async () => {
    const mockInvitations = [
      createMockInvitation([
        "Alice Anderson",
        "Bob Brown",
        "Charlie Clark",
        "Diana Davis",
      ]),
    ];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "Charlie Clark",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toEqual(mockInvitations[0]);
  });

  it("should return first matching invitation", async () => {
    const mockInvitation1 = createMockInvitation(["John Doe"]);
    const mockInvitation2 = {
      ...createMockInvitation(["John Smith"]),
      id: "inv-2",
    };

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue([
      mockInvitation1,
      mockInvitation2,
    ]);

    const result = await findInvitationByGuestName(
      "John",
      mockWeddingId,
      "FIRST_NAME_ONLY"
    );

    expect(result).toEqual(mockInvitation1);
  });

  it("should handle invitations with null guest slots", async () => {
    const mockInvitations = [
      createMockInvitation(["John Doe", null, null, null]),
    ];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "John Doe",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toEqual(mockInvitations[0]);
  });

  it("should handle empty invitation list", async () => {
    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue([]);

    const result = await findInvitationByGuestName(
      "John Doe",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toBeNull();
  });

  it("should handle whitespace in names", async () => {
    const mockInvitations = [createMockInvitation(["John Doe"])];

    vi.mocked(drizzle.db.query.invitation.findMany).mockResolvedValue(
      mockInvitations
    );

    const result = await findInvitationByGuestName(
      "  John   Doe  ",
      mockWeddingId,
      "FULL_NAME"
    );

    expect(result).toEqual(mockInvitations[0]);
  });
});

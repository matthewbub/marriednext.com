import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGuestListData } from "./guestListService";
import * as drizzle from "@/database/drizzle";
import type { DbGuest, DbInvitationWithGuests } from "@/database/drizzle";

vi.mock("@/database/drizzle", () => ({
  getGuestList: vi.fn(),
  getInvitationsWithGuests: vi.fn(),
  getInvitationsCount: vi.fn(),
}));

const createMockGuest = (partial: Partial<DbGuest> = {}): DbGuest => ({
  id: "guest-1",
  weddingId: "wedding-1",
  invitationId: "invitation-1",
  dateEntrySubmitted: "2024-01-01T00:00:00Z",
  nameOnInvitation: "Ken",
  isAttending: true,
  hasPlusOne: false,
  ...partial,
});

const createMockInvitation = (
  partial: Partial<DbInvitationWithGuests> = {}
): DbInvitationWithGuests => ({
  id: "invitation-1",
  weddingId: "wedding-1",
  createdAt: "2024-01-01T00:00:00Z",
  lastUpdatedAt: "2024-01-01T00:00:00Z",
  inviteGroupName: "Ken & Terri",
  email: null,
  guests: [
    createMockGuest({ nameOnInvitation: "Ken" }),
    createMockGuest({ nameOnInvitation: "Terri", id: "guest-2" }),
  ],
  ...partial,
});

describe("getGuestListData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("invitations array structure", () => {
    it("should return invitations with guestA, guestB, and inviteGroupName fields", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken" }),
        createMockGuest({ nameOnInvitation: "Terri", id: "guest-2" }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          inviteGroupName: "Ken & Terri",
          guests: mockGuests,
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(result.invitations).toHaveLength(1);
      const kenTerriInvite = result.invitations[0];
      expect(kenTerriInvite).toBeDefined();
      expect(kenTerriInvite.inviteGroupName).toBe("Ken & Terri");
      expect(kenTerriInvite.guests).toHaveLength(2);
    });

    it("should include exact fields in invitation object", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken" }),
        createMockGuest({ nameOnInvitation: "Terri", id: "guest-2" }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          inviteGroupName: "Ken & Terri",
          guests: mockGuests,
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      const invitation = result.invitations[0];
      expect(invitation).toBeDefined();
      expect(invitation).toHaveProperty("inviteGroupName");
      expect(invitation.inviteGroupName).toBe("Ken & Terri");
    });

    it("should handle invitation with null guestB", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken" }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          inviteGroupName: "Ken",
          guests: mockGuests,
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      const kenInvite = result.invitations[0];
      expect(kenInvite).toBeDefined();
      expect(kenInvite.inviteGroupName).toBe("Ken");
      expect(kenInvite.guests).toHaveLength(1);
    });

    it("should handle multiple invitations with correct field structure", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken" }),
        createMockGuest({ nameOnInvitation: "Terri", id: "guest-2" }),
        createMockGuest({ nameOnInvitation: "John", id: "guest-3" }),
        createMockGuest({ nameOnInvitation: "Jane", id: "guest-4" }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          id: "invitation-1",
          inviteGroupName: "Ken & Terri",
          guests: [mockGuests[0], mockGuests[1]],
        }),
        createMockInvitation({
          id: "invitation-2",
          inviteGroupName: "John & Jane",
          guests: [mockGuests[2], mockGuests[3]],
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(2);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(result.invitations).toHaveLength(2);
      expect(result.invitations[0].inviteGroupName).toBe("Ken & Terri");
      expect(result.invitations[1].inviteGroupName).toBe("John & Jane");
    });

    it("should include attending and total fields alongside guest fields", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken", isAttending: true }),
        createMockGuest({
          nameOnInvitation: "Terri",
          id: "guest-2",
          isAttending: true,
        }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          inviteGroupName: "Ken & Terri",
          guests: mockGuests,
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      const kenTerriInvite = result.invitations[0];
      expect(kenTerriInvite).toBeDefined();
      expect(kenTerriInvite).toMatchObject({
        inviteGroupName: "Ken & Terri",
        attending: 2,
        total: 2,
      });
    });
  });

  describe("count fields", () => {
    it("should return guestListCount as a number", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken", hasPlusOne: false }),
        createMockGuest({
          nameOnInvitation: "Terri",
          id: "guest-2",
          hasPlusOne: true,
        }),
        createMockGuest({
          nameOnInvitation: "John",
          id: "guest-3",
          hasPlusOne: false,
        }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({ guests: mockGuests }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(typeof result.guestListCount).toBe("number");
      expect(result.guestListCount).toBe(4);
    });

    it("should return invitationsCount as a number", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({ guests: mockGuests }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(42);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(typeof result.invitationsCount).toBe("number");
      expect(result.invitationsCount).toBe(42);
    });

    it("should return plusOneCount as a number", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken", hasPlusOne: true }),
        createMockGuest({
          nameOnInvitation: "Terri",
          id: "guest-2",
          hasPlusOne: false,
        }),
        createMockGuest({
          nameOnInvitation: "John",
          id: "guest-3",
          hasPlusOne: true,
        }),
        createMockGuest({
          nameOnInvitation: "Jane",
          id: "guest-4",
          hasPlusOne: true,
        }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({ guests: mockGuests }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(typeof result.plusOneCount).toBe("number");
      expect(result.plusOneCount).toBe(3);
    });

    it("should handle zero counts correctly", async () => {
      vi.mocked(drizzle.getGuestList).mockResolvedValue([]);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue([]);
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(0);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(typeof result.guestListCount).toBe("number");
      expect(typeof result.invitationsCount).toBe("number");
      expect(typeof result.plusOneCount).toBe("number");
      expect(result.guestListCount).toBe(0);
      expect(result.invitationsCount).toBe(0);
      expect(result.plusOneCount).toBe(0);
    });
  });

  describe("general functionality", () => {
    it("should handle empty guest list", async () => {
      vi.mocked(drizzle.getGuestList).mockResolvedValue([]);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue([]);
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(0);

      const result = await getGuestListData({ weddingId: "wedding-1" });

      expect(result.invitations).toEqual([]);
      expect(result.guestList).toEqual([]);
      expect(result.invitationsCount).toBe(0);
    });

    it("should apply default pagination parameters", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({ guests: mockGuests }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      await getGuestListData({ weddingId: "wedding-1" });

      expect(drizzle.getInvitationsWithGuests).toHaveBeenCalledWith(
        "wedding-1",
        "alpha-asc",
        25,
        0
      );
    });

    it("should use custom pagination parameters", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({ guests: mockGuests }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(100);

      await getGuestListData({
        weddingId: "wedding-1",
        sortBy: "date-newest",
        limit: 50,
        offset: 25,
      });

      expect(drizzle.getInvitationsWithGuests).toHaveBeenCalledWith(
        "wedding-1",
        "date-newest",
        50,
        25
      );
    });

    it("should calculate hasMore correctly", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({ guests: mockGuests }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(100);

      const result = await getGuestListData({
        weddingId: "wedding-1",
        limit: 25,
        offset: 0,
      });

      expect(result.hasMore).toBe(true);
      expect(result.currentOffset).toBe(0);
      expect(result.currentLimit).toBe(25);
    });
  });
});

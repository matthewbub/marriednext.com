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
  guestA: "Ken",
  guestB: "Terri",
  guestC: null,
  guestD: null,
  guestE: null,
  guestF: null,
  guestG: null,
  guestH: null,
  createdAt: "2024-01-01T00:00:00Z",
  lastUpdatedAt: "2024-01-01T00:00:00Z",
  inviteGroupName: "Ken & Terri",
  guest_guestA: createMockGuest({ nameOnInvitation: "Ken" }),
  guest_guestB: createMockGuest({ nameOnInvitation: "Terri", id: "guest-2" }),
  guest_guestC: null,
  guest_guestD: null,
  guest_guestE: null,
  guest_guestF: null,
  guest_guestG: null,
  guest_guestH: null,
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
          guestA: "Ken",
          guestB: "Terri",
          inviteGroupName: "Ken & Terri",
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData();

      expect(result.invitations).toHaveLength(1);
      const kenTerriInvite = result.invitations.find(
        (inv) => inv.guestA === "Ken" && inv.guestB === "Terri"
      );
      expect(kenTerriInvite).toBeDefined();
      expect(kenTerriInvite).toMatchObject({
        guestA: "Ken",
        guestB: "Terri",
        inviteGroupName: "Ken & Terri",
      });
    });

    it("should include exact fields in invitation object", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken" }),
        createMockGuest({ nameOnInvitation: "Terri", id: "guest-2" }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          guestA: "Ken",
          guestB: "Terri",
          inviteGroupName: "Ken & Terri",
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData();

      const invitation = result.invitations.find(
        (inv) => inv.guestA === "Ken" && inv.guestB === "Terri"
      );
      expect(invitation).toBeDefined();
      expect(invitation).toHaveProperty("guestA");
      expect(invitation).toHaveProperty("guestB");
      expect(invitation).toHaveProperty("inviteGroupName");
      expect(invitation!.guestA).toBe("Ken");
      expect(invitation!.guestB).toBe("Terri");
      expect(invitation!.inviteGroupName).toBe("Ken & Terri");
    });

    it("should handle invitation with null guestB", async () => {
      const mockGuests: DbGuest[] = [
        createMockGuest({ nameOnInvitation: "Ken" }),
      ];

      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation({
          guestA: "Ken",
          guestB: null,
          inviteGroupName: "Ken",
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData();

      const kenInvite = result.invitations.find(
        (inv) => inv.guestA === "Ken" && inv.guestB === null
      );
      expect(kenInvite).toBeDefined();
      expect(kenInvite).toMatchObject({
        guestA: "Ken",
        guestB: null,
        inviteGroupName: "Ken",
      });
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
          guestA: "Ken",
          guestB: "Terri",
          inviteGroupName: "Ken & Terri",
        }),
        createMockInvitation({
          id: "invitation-2",
          guestA: "John",
          guestB: "Jane",
          inviteGroupName: "John & Jane",
          guest_guestA: createMockGuest({
            nameOnInvitation: "John",
            id: "guest-3",
          }),
          guest_guestB: createMockGuest({
            nameOnInvitation: "Jane",
            id: "guest-4",
          }),
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(2);

      const result = await getGuestListData();

      expect(result.invitations).toHaveLength(2);

      const kenTerriInvite = result.invitations.find(
        (inv) => inv.guestA === "Ken" && inv.guestB === "Terri"
      );
      expect(kenTerriInvite).toBeDefined();
      expect(kenTerriInvite).toMatchObject({
        guestA: "Ken",
        guestB: "Terri",
        inviteGroupName: "Ken & Terri",
      });

      const johnJaneInvite = result.invitations.find(
        (inv) => inv.guestA === "John" && inv.guestB === "Jane"
      );
      expect(johnJaneInvite).toBeDefined();
      // TODO this should fail
      expect(johnJaneInvite).toMatchObject({
        guestA: "John",
        guestB: "Jane",
        inviteGroupName: "John & Jane",
      });
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
          guestA: "Ken",
          guestB: "Terri",
          inviteGroupName: "Ken & Terri",
          guest_guestA: mockGuests[0],
          guest_guestB: mockGuests[1],
        }),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData();

      const kenTerriInvite = result.invitations.find(
        (inv) => inv.guestA === "Ken" && inv.guestB === "Terri"
      );
      expect(kenTerriInvite).toBeDefined();
      expect(kenTerriInvite).toMatchObject({
        guestA: "Ken",
        guestB: "Terri",
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
        createMockInvitation(),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData();

      expect(typeof result.guestListCount).toBe("number");
      expect(result.guestListCount).toBe(4);
    });

    it("should return invitationsCount as a number", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation(),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(42);

      const result = await getGuestListData();

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
        createMockInvitation(),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      const result = await getGuestListData();

      expect(typeof result.plusOneCount).toBe("number");
      expect(result.plusOneCount).toBe(3);
    });

    it("should handle zero counts correctly", async () => {
      vi.mocked(drizzle.getGuestList).mockResolvedValue([]);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue([]);
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(0);

      const result = await getGuestListData();

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

      const result = await getGuestListData();

      expect(result.invitations).toEqual([]);
      expect(result.guestList).toEqual([]);
      expect(result.invitationsCount).toBe(0);
    });

    it("should apply default pagination parameters", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation(),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(1);

      await getGuestListData();

      expect(drizzle.getInvitationsWithGuests).toHaveBeenCalledWith(
        "alpha-asc",
        25,
        0
      );
    });

    it("should use custom pagination parameters", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation(),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(100);

      await getGuestListData({
        sortBy: "date-newest",
        limit: 50,
        offset: 25,
      });

      expect(drizzle.getInvitationsWithGuests).toHaveBeenCalledWith(
        "date-newest",
        50,
        25
      );
    });

    it("should calculate hasMore correctly", async () => {
      const mockGuests: DbGuest[] = [createMockGuest()];
      const mockInvitations: DbInvitationWithGuests[] = [
        createMockInvitation(),
      ];

      vi.mocked(drizzle.getGuestList).mockResolvedValue(mockGuests);
      vi.mocked(drizzle.getInvitationsWithGuests).mockResolvedValue(
        mockInvitations as Awaited<
          ReturnType<typeof drizzle.getInvitationsWithGuests>
        >
      );
      vi.mocked(drizzle.getInvitationsCount).mockResolvedValue(100);

      const result = await getGuestListData({
        limit: 25,
        offset: 0,
      });

      expect(result.hasMore).toBe(true);
      expect(result.currentOffset).toBe(0);
      expect(result.currentLimit).toBe(25);
    });
  });
});

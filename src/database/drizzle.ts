import { drizzle } from "drizzle-orm/postgres-js";
import { eq, sql } from "drizzle-orm";
import queryClient from "./neon";
import { invitation, guest } from "@/drizzle/schema";
import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";
import type { InferSelectModel } from "drizzle-orm";

export const db = drizzle(queryClient, { schema: { ...schema, ...relations } });

export type DbGuest = InferSelectModel<typeof guest>;
export type DbInvitation = InferSelectModel<typeof invitation>;

export type DbInvitationWithGuests = DbInvitation & {
  guest_guestA: DbGuest | null;
  guest_guestB: DbGuest | null;
  guest_guestC: DbGuest | null;
  guest_guestD: DbGuest | null;
  guest_guestE: DbGuest | null;
  guest_guestF: DbGuest | null;
  guest_guestG: DbGuest | null;
  guest_guestH: DbGuest | null;
  attending?: number;
  total?: number;
};

export type DbInvitationGroupWithGuests = DbInvitationWithGuests;
export type DbInvitationGroup = DbInvitation;

export const getGuestList = async (): Promise<DbGuest[]> => {
  const guestList = await db.select().from(guest);
  return guestList;
};

export const getInvitationsWithGuests = async (
  sortBy?: string,
  limit?: number,
  offset?: number
) => {
  try {
    const result = await db.query.invitation.findMany({
      with: {
        guest_guestA: true,
        guest_guestB: true,
        guest_guestC: true,
        guest_guestD: true,
        guest_guestE: true,
        guest_guestF: true,
        guest_guestG: true,
        guest_guestH: true,
      },
      orderBy: (i, { asc, desc }) => {
        switch (sortBy) {
          case "alpha-desc":
            return [desc(sql`COALESCE(${i.inviteGroupName}, ${i.guestA})`)];
          case "date-newest":
            return [desc(i.createdAt)];
          case "date-oldest":
            return [asc(i.createdAt)];
          case "updated-newest":
            return [desc(i.lastUpdatedAt)];
          case "alpha-asc":
          default:
            return [asc(sql`COALESCE(${i.inviteGroupName}, ${i.guestA})`)];
        }
      },
      limit: limit,
      offset: offset,
    });
    return result;
  } catch (error) {
    console.error("Error getting invitations with guests", error);
    return [];
  }
};

export const getInvitationsCount = async () => {
  try {
    const result = await db.select().from(invitation);
    return result.length;
  } catch (error) {
    console.error("Error getting invitations count", error);
    return 0;
  }
};

export default db;

export const upsertGuest = async ({
  nameOnInvitation,
  isAttending,
  hasPlusOne,
}: {
  nameOnInvitation: string;
  isAttending: boolean;
  hasPlusOne: boolean | null | undefined;
}): Promise<void> => {
  const guestData = {
    nameOnInvitation,
    isAttending,
    hasPlusOne: hasPlusOne ?? null,
  };
  await db
    .update(guest)
    .set(guestData)
    .where(eq(guest.nameOnInvitation, nameOnInvitation));
};

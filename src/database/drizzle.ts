import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import queryClient from "./neon";
import { invitationGroups, invitations } from "@/drizzle/schema";
import * as schema from "@/drizzle/schema";
import * as relations from "@/drizzle/relations";
import type { InferSelectModel } from "drizzle-orm";

export const db = drizzle(queryClient, { schema: { ...schema, ...relations } });

export type DbInvitation = InferSelectModel<typeof invitations>;
export type DbInvitationGroup = InferSelectModel<typeof invitationGroups>;

export type DbInvitationGroupWithGuests = DbInvitationGroup & {
  invitation_guestA: DbInvitation | null;
  invitation_guestB: DbInvitation | null;
  invitation_guestC: DbInvitation | null;
  invitation_guestD: DbInvitation | null;
  invitation_guestE: DbInvitation | null;
  invitation_guestF: DbInvitation | null;
  invitation_guestG: DbInvitation | null;
  invitation_guestH: DbInvitation | null;
  attending?: number;
  total?: number;
};

export const getGuestList = async (): Promise<DbInvitation[]> => {
  const guestList = await db.select().from(invitations);
  return guestList;
};

export const getGuestListWithGroups = async (
  sortBy?: string,
  limit?: number,
  offset?: number
) => {
  try {
    const result = await db.query.invitationGroups.findMany({
      with: {
        invitation_guestA: true,
        invitation_guestB: true,
        invitation_guestC: true,
        invitation_guestD: true,
        invitation_guestE: true,
        invitation_guestF: true,
        invitation_guestG: true,
        invitation_guestH: true,
      },
      orderBy: (invitationGroups, { asc, desc, sql }) => {
        switch (sortBy) {
          case "alpha-desc":
            return [
              desc(
                sql`COALESCE(${invitationGroups.inviteGroupName}, ${invitationGroups.guestA})`
              ),
            ];
          case "date-newest":
            return [desc(invitationGroups.createdAt)];
          case "date-oldest":
            return [asc(invitationGroups.createdAt)];
          case "updated-newest":
            return [desc(invitationGroups.lastUpdatedAt)];
          case "alpha-asc":
          default:
            return [
              asc(
                sql`COALESCE(${invitationGroups.inviteGroupName}, ${invitationGroups.guestA})`
              ),
            ];
        }
      },
      limit: limit,
      offset: offset,
    });
    return result;
  } catch (error) {
    console.error("Error getting guest list with groups", error);
    return [];
  }
};

export const getGuestListWithGroupsCount = async () => {
  try {
    const result = await db.select().from(invitationGroups);
    return result.length;
  } catch (error) {
    console.error("Error getting guest list with groups count", error);
    return 0;
  }
};

export default db;

export const insertInvitation = async ({
  nameOnInvitation,
  isAttending,
  hasPlusOne,
}: {
  nameOnInvitation: string;
  isAttending: boolean;
  hasPlusOne: boolean | null | undefined;
}): Promise<void> => {
  const invitation = {
    nameOnInvitation,
    isAttending,
    hasPlusOne: hasPlusOne ?? null,
  };
  await db
    .update(invitations)
    .set(invitation)
    .where(eq(invitations.nameOnInvitation, nameOnInvitation));
};

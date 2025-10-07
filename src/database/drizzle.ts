import { drizzle } from "drizzle-orm/postgres-js";
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
};

export const getGuestList = async (): Promise<DbInvitation[]> => {
  const guestList = await db.select().from(invitations);
  return guestList;
};

export const getGuestListWithGroups = async () => {
  try {
    const result = await db.query.invitationGroups.findMany({
      with: {
        invitation_guestA: true,
        invitation_guestB: true,
      },
    });
    return result;
  } catch (error) {
    console.error("Error getting guest list with groups", error);
    return [];
  }
};

export default db;

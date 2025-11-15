import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import { invitation, guest, weddingUsers } from "@/drizzle/schema";
import * as schema from "@/drizzle/schema";
import {
  guestRelations,
  weddingRelations,
  invitationRelations,
  weddingUsersRelations,
} from "@/drizzle/relations";
import type { InferSelectModel } from "drizzle-orm";
import postgres from "postgres";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const queryClient = postgres(DATABASE_URL, { ssl: "require" });
export const db = drizzle(queryClient, {
  schema: {
    ...schema,
    guestRelations,
    weddingRelations,
    invitationRelations,
    weddingUsersRelations,
  },
});

export type DbGuest = InferSelectModel<typeof guest>;
export type DbInvitation = InferSelectModel<typeof invitation>;
export type DbWeddingUser = InferSelectModel<typeof weddingUsers>;

export type DbInvitationWithGuests = DbInvitation & {
  guests: DbGuest[];
  attending?: number;
  total?: number;
};

export type DbInvitationGroupWithGuests = DbInvitationWithGuests;
export type DbInvitationGroup = DbInvitation;

export const getGuestList = async (weddingId: string): Promise<DbGuest[]> => {
  const guestList = await db
    .select()
    .from(guest)
    .where(eq(guest.weddingId, weddingId));
  return guestList;
};

export const getInvitationsWithGuests = async (
  weddingId: string,
  sortBy?: string,
  limit?: number,
  offset?: number
) => {
  try {
    const result = await db.query.invitation.findMany({
      where: eq(invitation.weddingId, weddingId),
      with: {
        guests: true,
      },
      orderBy: (i, { asc, desc }) => {
        switch (sortBy) {
          case "alpha-desc":
            return [desc(i.inviteGroupName)];
          case "date-newest":
            return [desc(i.createdAt)];
          case "date-oldest":
            return [asc(i.createdAt)];
          case "updated-newest":
            return [desc(i.lastUpdatedAt)];
          case "alpha-asc":
          default:
            return [asc(i.inviteGroupName)];
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

export const getInvitationsCount = async (weddingId: string) => {
  try {
    const result = await db
      .select()
      .from(invitation)
      .where(eq(invitation.weddingId, weddingId));
    return result.length;
  } catch (error) {
    console.error("Error getting invitations count", error);
    return 0;
  }
};

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

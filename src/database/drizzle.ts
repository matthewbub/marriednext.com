import { drizzle } from "drizzle-orm/postgres-js";
import queryClient from "./neon";
import { invitations } from "@/drizzle/schema";
import type { InferSelectModel } from "drizzle-orm";

const db = drizzle(queryClient);

export type DbInvitation = InferSelectModel<typeof invitations>;

export const getGuestList = async (): Promise<DbInvitation[]> => {
  const guestList = await db.select().from(invitations);
  return guestList;
};

export default db;

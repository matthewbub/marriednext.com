import { relations } from "drizzle-orm/relations";
import { wedding, guest, invitation, weddingUsers } from "./schema";

export const guestRelations = relations(guest, ({ one }) => ({
  wedding: one(wedding, {
    fields: [guest.weddingId],
    references: [wedding.id],
  }),
  invitation: one(invitation, {
    fields: [guest.invitationId],
    references: [invitation.id],
  }),
}));

export const weddingRelations = relations(wedding, ({ many }) => ({
  guests: many(guest),
  invitations: many(invitation),
  weddingUsers: many(weddingUsers),
}));

export const invitationRelations = relations(invitation, ({ one, many }) => ({
  wedding: one(wedding, {
    fields: [invitation.weddingId],
    references: [wedding.id],
  }),
  guests: many(guest),
}));

export const weddingUsersRelations = relations(weddingUsers, ({ one }) => ({
  wedding: one(wedding, {
    fields: [weddingUsers.weddingId],
    references: [wedding.id],
  }),
}));

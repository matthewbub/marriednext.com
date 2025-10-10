import { relations } from "drizzle-orm/relations";
import { invitations, invitationGroups } from "./schema";

export const invitationGroupsRelations = relations(
  invitationGroups,
  ({ one }) => ({
    invitation_guestA: one(invitations, {
      fields: [invitationGroups.guestA],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestA_invitations_nameOnInvitation",
    }),
    invitation_guestB: one(invitations, {
      fields: [invitationGroups.guestB],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestB_invitations_nameOnInvitation",
    }),
    invitation_guestC: one(invitations, {
      fields: [invitationGroups.guestC],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestC_invitations_nameOnInvitation",
    }),
    invitation_guestD: one(invitations, {
      fields: [invitationGroups.guestD],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestD_invitations_nameOnInvitation",
    }),
    invitation_guestE: one(invitations, {
      fields: [invitationGroups.guestE],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestE_invitations_nameOnInvitation",
    }),
    invitation_guestF: one(invitations, {
      fields: [invitationGroups.guestF],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestF_invitations_nameOnInvitation",
    }),
    invitation_guestG: one(invitations, {
      fields: [invitationGroups.guestG],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestG_invitations_nameOnInvitation",
    }),
    invitation_guestH: one(invitations, {
      fields: [invitationGroups.guestH],
      references: [invitations.nameOnInvitation],
      relationName: "invitationGroups_guestH_invitations_nameOnInvitation",
    }),
  })
);

export const invitationsRelations = relations(invitations, ({ many }) => ({
  invitationGroups_guestA: many(invitationGroups, {
    relationName: "invitationGroups_guestA_invitations_nameOnInvitation",
  }),
  invitationGroups_guestB: many(invitationGroups, {
    relationName: "invitationGroups_guestB_invitations_nameOnInvitation",
  }),
  invitationGroups_guestC: many(invitationGroups, {
    relationName: "invitationGroups_guestC_invitations_nameOnInvitation",
  }),
  invitationGroups_guestD: many(invitationGroups, {
    relationName: "invitationGroups_guestD_invitations_nameOnInvitation",
  }),
  invitationGroups_guestE: many(invitationGroups, {
    relationName: "invitationGroups_guestE_invitations_nameOnInvitation",
  }),
  invitationGroups_guestF: many(invitationGroups, {
    relationName: "invitationGroups_guestF_invitations_nameOnInvitation",
  }),
  invitationGroups_guestG: many(invitationGroups, {
    relationName: "invitationGroups_guestG_invitations_nameOnInvitation",
  }),
  invitationGroups_guestH: many(invitationGroups, {
    relationName: "invitationGroups_guestH_invitations_nameOnInvitation",
  }),
}));

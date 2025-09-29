import { relations } from "drizzle-orm/relations";
import { invitations, invitationGroups } from "./schema";

export const invitationGroupsRelations = relations(invitationGroups, ({one}) => ({
	invitation_guestA: one(invitations, {
		fields: [invitationGroups.guestA],
		references: [invitations.nameOnInvitation],
		relationName: "invitationGroups_guestA_invitations_nameOnInvitation"
	}),
	invitation_guestB: one(invitations, {
		fields: [invitationGroups.guestB],
		references: [invitations.nameOnInvitation],
		relationName: "invitationGroups_guestB_invitations_nameOnInvitation"
	}),
}));

export const invitationsRelations = relations(invitations, ({many}) => ({
	invitationGroups_guestA: many(invitationGroups, {
		relationName: "invitationGroups_guestA_invitations_nameOnInvitation"
	}),
	invitationGroups_guestB: many(invitationGroups, {
		relationName: "invitationGroups_guestB_invitations_nameOnInvitation"
	}),
}));
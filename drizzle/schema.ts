import { pgTable, unique, serial, timestamp, text, boolean, foreignKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const invitations = pgTable("invitations", {
	id: serial().primaryKey().notNull(),
	dateEntrySubmitted: timestamp("date_entry_submitted", { mode: 'string' }).defaultNow(),
	nameOnInvitation: text("name_on_invitation").notNull(),
	isAttending: boolean("is_attending").default(false),
	hasPlusOne: boolean("has_plus_one").default(false),
}, (table) => [
	unique("uq_invitation_name").on(table.nameOnInvitation),
]);

export const invitationGroups = pgTable("invitation_groups", {
	id: serial().primaryKey().notNull(),
	guestA: text("guest_a").notNull(),
	guestB: text("guest_b"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.guestA],
			foreignColumns: [invitations.nameOnInvitation],
			name: "fk_guest_a"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.guestB],
			foreignColumns: [invitations.nameOnInvitation],
			name: "fk_guest_b"
		}).onUpdate("cascade").onDelete("cascade"),
]);

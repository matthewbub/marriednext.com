import { pgTable, serial, timestamp, text, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const invitations = pgTable("invitations", {
	id: serial().primaryKey().notNull(),
	dateEntrySubmitted: timestamp("date_entry_submitted", { mode: 'string' }).defaultNow(),
	nameOnInvitation: text("name_on_invitation").notNull(),
	isAttending: boolean("is_attending").default(false),
	hasPlusOne: boolean("has_plus_one").default(false),
});

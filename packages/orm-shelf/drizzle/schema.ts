import {
  pgTable,
  unique,
  uuid,
  text,
  timestamp,
  jsonb,
  foreignKey,
  boolean,
  real,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
]);
export const rsvpNameFormat = pgEnum("rsvp_name_format", [
  "FIRST_NAME_ONLY",
  "FULL_NAME",
]);
export const tableType = pgEnum("table_type", [
  "square",
  "rectangle",
  "circle",
]);
export const userRole = pgEnum("user_role", ["spouse", "family", "planner"]);

export const wedding = pgTable(
  "wedding",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    subdomain: text(),
    customDomain: text("custom_domain"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    fieldDisplayName: text("field_display_name"),
    fieldLocationName: text("field_location_name"),
    fieldLocationAddress: text("field_location_address"),
    fieldEventDate: timestamp("field_event_date", { mode: "string" }),
    fieldEventTime: text("field_event_time"),
    fieldMapsEmbedUrl: text("field_maps_embed_url"),
    fieldMapsShareUrl: text("field_maps_share_url"),
    fieldQuestionsAndAnswers: jsonb("field_questions_and_answers"),
    fieldOurStory: jsonb("field_our_story"),
    fieldNameA: text("field_name_a"),
    fieldNameB: text("field_name_b"),
    controlRsvpNameFormat: rsvpNameFormat("control_rsvp_name_format")
      .default("FULL_NAME")
      .notNull(),
    createdByClerkUserId: text("created_by_clerk_user_id").notNull(),
    fieldPreferredLocationAddressLine1: text(
      "field_preferred_location_address_line_1"
    ),
    fieldPreferredLocationAddressLine2: text(
      "field_preferred_location_address_line_2"
    ),
    fieldPreferredLocationCity: text("field_preferred_location_city"),
    fieldPreferredLocationState: text("field_preferred_location_state"),
    fieldPreferredLocationZipCode: text("field_preferred_location_zip_code"),
    fieldPreferredLocationCountry: text("field_preferred_location_country"),
  },
  (table) => [
    unique("weddings_subdomain_unique").on(table.subdomain),
    unique("wedding_subdomain_unique").on(table.subdomain),
    unique("weddings_custom_domain_unique").on(table.customDomain),
    unique("wedding_custom_domain_unique").on(table.customDomain),
  ]
);

export const guest = pgTable(
  "guest",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id"),
    dateEntrySubmitted: timestamp("date_entry_submitted", {
      mode: "string",
    }).defaultNow(),
    nameOnInvitation: text("name_on_invitation").notNull(),
    isAttending: boolean("is_attending"),
    hasPlusOne: boolean("has_plus_one"),
    invitationId: uuid("invitation_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.weddingId],
      foreignColumns: [wedding.id],
      name: "fk_guest_wedding",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.invitationId],
      foreignColumns: [invitation.id],
      name: "fk_guest_invitation",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("uq_guest_name").on(table.nameOnInvitation),
  ]
);

export const invitation = pgTable(
  "invitation",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    lastUpdatedAt: timestamp("last_updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    inviteGroupName: text("invite_group_name"),
    email: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.weddingId],
      foreignColumns: [wedding.id],
      name: "fk_invitation_wedding",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const weddingUsers = pgTable(
  "wedding_users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id").notNull(),
    clerkUserId: text("clerk_user_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    role: userRole().default("spouse").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.weddingId],
      foreignColumns: [wedding.id],
      name: "fk_wedding_users_wedding",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("wedding_users_wedding_clerk_unique").on(
      table.weddingId,
      table.clerkUserId
    ),
  ]
);

export const collaboratorInvitations = pgTable(
  "collaborator_invitations",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id").notNull(),
    invitedEmail: text("invited_email").notNull(),
    invitedByName: text("invited_by_name").notNull(),
    role: userRole().notNull(),
    status: invitationStatus().default("pending").notNull(),
    sentAt: timestamp("sent_at", { mode: "string" }).defaultNow().notNull(),
    respondedAt: timestamp("responded_at", { mode: "string" }),
    invitationId: text("invitation_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.weddingId],
      foreignColumns: [wedding.id],
      name: "fk_collaborator_invitations_wedding",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const seatingTable = pgTable(
  "seating_table",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id").notNull(),
    type: tableType().notNull(),
    x: real().notNull(),
    y: real().notNull(),
    tableName: text("table_name"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.weddingId],
      foreignColumns: [wedding.id],
      name: "fk_seating_table_wedding",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
  ]
);

export const seatAssignment = pgTable(
  "seat_assignment",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    tableId: uuid("table_id").notNull(),
    guestId: uuid("guest_id").notNull(),
    seatPosition: integer("seat_position").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.tableId],
      foreignColumns: [seatingTable.id],
      name: "fk_seat_assignment_table",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    foreignKey({
      columns: [table.guestId],
      foreignColumns: [guest.id],
      name: "fk_seat_assignment_guest",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    unique("uq_seat_assignment_table_guest").on(table.tableId, table.guestId),
  ]
);

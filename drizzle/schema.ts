import {
  pgTable,
  foreignKey,
  unique,
  uuid,
  timestamp,
  text,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

export const rsvpNameFormat = pgEnum("rsvp_name_format", [
  "FIRST_NAME_ONLY",
  "FULL_NAME",
]);

export const userRole = pgEnum("user_role", ["spouse", "family", "planner"]);

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "declined",
]);

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

export const guest = pgTable(
  "guest",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id"),
    invitationId: uuid("invitation_id"),
    dateEntrySubmitted: timestamp("date_entry_submitted", {
      mode: "string",
    }).defaultNow(),
    nameOnInvitation: text("name_on_invitation").notNull(),
    isAttending: boolean("is_attending"),
    hasPlusOne: boolean("has_plus_one"),
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

export const wedding = pgTable(
  "wedding",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    subdomain: text().unique(),
    customDomain: text("custom_domain").unique(),
    createdByClerkUserId: text("created_by_clerk_user_id").notNull(),
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
  },
  (table) => [
    unique("weddings_subdomain_unique").on(table.subdomain),
    unique("weddings_custom_domain_unique").on(table.customDomain),
  ]
);

// this should be renamed to weddingCollaborators .. but not right now
export const weddingUsers = pgTable(
  "wedding_users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    weddingId: uuid("wedding_id").notNull(),
    clerkUserId: text("clerk_user_id").notNull(),
    role: userRole("role").notNull().default("spouse"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
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
    invitationId: text("invitation_id").notNull(),
    invitedEmail: text("invited_email").notNull(),
    invitedByName: text("invited_by_name").notNull(),
    role: userRole("role").notNull(),
    status: invitationStatus("status").default("pending").notNull(),
    sentAt: timestamp("sent_at", { mode: "string" }).defaultNow().notNull(),
    respondedAt: timestamp("responded_at", { mode: "string" }),
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

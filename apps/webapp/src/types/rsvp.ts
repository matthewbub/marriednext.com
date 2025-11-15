import { DbInvitationWithGuests } from "@/database/drizzle";

export type RsvpNameFormat = "FIRST_NAME_ONLY" | "FULL_NAME";

export type GuestSelection = {
  name: string;
  isAttending: boolean;
};

export type RsvpFormStep =
  | "name-input"
  | "guest-selection"
  | "email-collection"
  | "success"
  | "error";

export type RsvpFormState = {
  step: RsvpFormStep;
  inputName: string;
  invitation: DbInvitationWithGuests | null;
  selectedGuests: GuestSelection[];
  email: string;
  nameFormat: RsvpNameFormat;
  isLoading: boolean;
  errorMessage: string | null;
};

export type RsvpSubmission = {
  invitationId: string;
  email: string;
  guests: GuestSelection[];
};

export type InvitationLookupResponse = {
  invitation: DbInvitationWithGuests;
  nameFormat: RsvpNameFormat;
};

export type RsvpApiResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

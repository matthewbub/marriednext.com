export type RSVPStatus = "pending" | "yes" | "no";

export interface Invitation {
  id: number;
  wedding_id: number;
  invitation_name: string;
  created_at: string; // ISO timestamp
}

export interface Guest {
  id: number;
  invitation_id: number;
  name: string;
  is_plus_one: boolean;
  alternative_names: string | null;
  rsvp_status: RSVPStatus;
  created_at: string; // ISO timestamp
}

export interface GuestListResponse {
  invitations: Invitation[];
  guests: Guest[];
}

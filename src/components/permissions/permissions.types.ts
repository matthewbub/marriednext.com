export type UserRole = "spouse" | "family" | "planner";

export type InvitationStatus = "pending" | "accepted" | "declined";

export interface CollaboratorInvitation {
  id: string;
  email: string;
  role: UserRole;
  status: InvitationStatus;
  sentAt: string;
  acceptedAt?: string;
  declinedAt?: string;
}

export interface InviteUserFormData {
  email: string;
  role: UserRole;
}


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CollaboratorInvitationCard } from "@/components/permissions/CollaboratorInvitationCard";
import { InviteUserDialog } from "@/components/permissions/InviteUserDialog";
import { CurrentUserCard } from "@/components/permissions/CurrentUserCard";
import {
  CollaboratorInvitation,
  InviteUserFormData,
  UserRole,
} from "@/components/permissions/permissions.types";
import { toast } from "sonner";

const mockCollaboratorInvitations: CollaboratorInvitation[] = [
  {
    id: "1",
    email: "partner@example.com",
    role: "spouse",
    status: "accepted",
    message: "Can't wait to plan together!",
    sentAt: "2024-10-15T10:00:00Z",
    acceptedAt: "2024-10-15T14:30:00Z",
  },
  {
    id: "2",
    email: "mom@example.com",
    role: "family",
    status: "accepted",
    sentAt: "2024-10-18T09:15:00Z",
    acceptedAt: "2024-10-18T11:45:00Z",
  },
  {
    id: "3",
    email: "planner@weddings.com",
    role: "planner",
    status: "pending",
    message: "Looking forward to working with you",
    sentAt: "2024-10-25T16:20:00Z",
  },
  {
    id: "4",
    email: "sibling@example.com",
    role: "family",
    status: "declined",
    sentAt: "2024-10-20T13:00:00Z",
    declinedAt: "2024-10-21T08:15:00Z",
  },
];

export default function PermissionsPage() {
  const [invitations, setInvitations] = useState<CollaboratorInvitation[]>(
    mockCollaboratorInvitations
  );
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("spouse");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInviteUser = (data: InviteUserFormData) => {
    const newInvitation: CollaboratorInvitation = {
      id: Date.now().toString(),
      email: data.email,
      role: data.role,
      status: "pending",
      message: data.message || undefined,
      sentAt: new Date().toISOString(),
    };

    setInvitations([newInvitation, ...invitations]);
    setIsDialogOpen(false);
    toast.success(`Invitation sent to ${data.email}`);
  };

  const handleRemoveInvitation = (id: string) => {
    const invitation = invitations.find((inv) => inv.id === id);
    setInvitations(invitations.filter((inv) => inv.id !== id));
    if (invitation) {
      toast.success(`Removed invitation for ${invitation.email}`);
    }
  };

  const handleResendInvitation = (id: string) => {
    const invitation = invitations.find((inv) => inv.id === id);
    if (invitation) {
      toast.success(`Resent invitation to ${invitation.email}`);
    }
  };

  const handleCopyInviteUrl = (id: string) => {
    const invitation = invitations.find((inv) => inv.id === id);
    if (invitation) {
      const mockUrl = `https://marriednext.com/invite/${id}`;
      navigator.clipboard.writeText(mockUrl);
      toast.success("Invite URL copied to clipboard");
    }
  };

  const handleChangeInvitationRole = (id: string, newRole: UserRole) => {
    setInvitations(
      invitations.map((inv) =>
        inv.id === id ? { ...inv, role: newRole } : inv
      )
    );
    const invitation = invitations.find((inv) => inv.id === id);
    if (invitation) {
      const roleLabel =
        newRole === "spouse"
          ? "Spouse"
          : newRole === "family"
          ? "Family Member"
          : "Wedding Planner";
      toast.success(`Changed ${invitation.email}'s role to ${roleLabel}`);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentUserRole(newRole);
    toast.success(
      `Role updated to ${
        newRole === "spouse"
          ? "Spouse"
          : newRole === "family"
          ? "Family Member"
          : "Wedding Planner"
      }`
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full mb-4 mt-20">
        <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
          <div className="mb-6">
            <h1 className="text-5xl font-bold mb-1">Permissions</h1>
            <p className="text-stone-700 text-lg mb-3">
              Invite collaborators to help manage your wedding website. All
              collaborators have full admin access.
            </p>
          </div>

          <div className="w-full flex justify-end mb-6">
            <Button onClick={() => setIsDialogOpen(true)}>
              Invite Collaborator
            </Button>
          </div>

          <InviteUserDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleInviteUser}
          />

          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
              Your Role
            </h2>
            <CurrentUserCard
              email="you@example.com"
              role={currentUserRole}
              onRoleChange={handleRoleChange}
            />
          </div>

          <h2 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
            Invitations
          </h2>

          {invitations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No collaborators yet
              </h3>
              <p className="text-gray-600">
                Get started by inviting someone to help manage your wedding
                website
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {invitations.map((invitation) => (
                <CollaboratorInvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  currentUserRole={currentUserRole}
                  onRemove={handleRemoveInvitation}
                  onResend={handleResendInvitation}
                  onCopyInviteUrl={handleCopyInviteUrl}
                  onChangeRole={handleChangeInvitationRole}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

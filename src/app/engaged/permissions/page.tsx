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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface PermissionsData {
  currentUser: {
    email: string;
    role: UserRole;
  };
  invitations: CollaboratorInvitation[];
}

export default function PermissionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<PermissionsData>({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await fetch("/api/permissions");
      return res.json();
    },
  });

  const updatePermissionsMutation = useMutation({
    mutationFn: async (updatedData: Partial<PermissionsData>) => {
      const res = await fetch("/api/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  const handleInviteUser = (formData: InviteUserFormData) => {
    const newInvitation: CollaboratorInvitation = {
      id: Date.now().toString(),
      email: formData.email,
      role: formData.role,
      status: "pending",
      message: formData.message || undefined,
      sentAt: new Date().toISOString(),
    };

    if (data) {
      updatePermissionsMutation.mutate({
        invitations: [newInvitation, ...data.invitations],
      });
    }
    setIsDialogOpen(false);
    toast.success(`Invitation sent to ${formData.email}`);
  };

  const handleRemoveInvitation = (id: string) => {
    if (!data) return;
    const invitation = data.invitations.find((inv) => inv.id === id);
    updatePermissionsMutation.mutate({
      invitations: data.invitations.filter((inv) => inv.id !== id),
    });
    if (invitation) {
      toast.success(`Removed invitation for ${invitation.email}`);
    }
  };

  const handleResendInvitation = (id: string) => {
    if (!data) return;
    const invitation = data.invitations.find((inv) => inv.id === id);
    if (invitation) {
      toast.success(`Resent invitation to ${invitation.email}`);
    }
  };

  const handleCopyInviteUrl = (id: string) => {
    if (!data) return;
    const invitation = data.invitations.find((inv) => inv.id === id);
    if (invitation) {
      const mockUrl = `https://marriednext.com/invite/${id}`;
      navigator.clipboard.writeText(mockUrl);
      toast.success("Invite URL copied to clipboard");
    }
  };

  const handleChangeInvitationRole = (id: string, newRole: UserRole) => {
    if (!data) return;
    updatePermissionsMutation.mutate({
      invitations: data.invitations.map((inv) =>
        inv.id === id ? { ...inv, role: newRole } : inv
      ),
    });
    const invitation = data.invitations.find((inv) => inv.id === id);
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
    if (!data) return;
    updatePermissionsMutation.mutate({
      currentUser: { ...data.currentUser, role: newRole },
    });
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

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const { currentUser, invitations } = data;

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
              email={currentUser.email}
              role={currentUser.role}
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
                  currentUserRole={currentUser.role}
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

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical } from "lucide-react";

interface Collaborator {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface PermissionsData {
  currentUser: {
    email: string;
    role: UserRole;
  };
  collaborators: Collaborator[];
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

  const inviteUserMutation = useMutation({
    mutationFn: async (formData: InviteUserFormData) => {
      const res = await fetch("/api/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send invitation");
      }
      return res.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      setIsDialogOpen(false);
      toast.success(`Invitation sent to ${variables.email}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
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

  const deleteInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      console.log("deleteInvitationMutation", invitationId);
      const res = await fetch("/api/permissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to revoke invitation");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleInviteUser = (formData: InviteUserFormData) => {
    inviteUserMutation.mutate(formData);
  };

  const handleRemoveInvitation = (id: string) => {
    if (!data) return;
    deleteInvitationMutation.mutate(id);
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

  const handleCollaboratorRoleChange = (
    collaboratorId: string,
    newRole: UserRole
  ) => {
    if (!data) return;
    updatePermissionsMutation.mutate({
      collaborators: data.collaborators.map((collab) =>
        collab.id === collaboratorId ? { ...collab, role: newRole } : collab
      ),
    });
    const collaborator = data.collaborators.find(
      (c) => c.id === collaboratorId
    );
    if (collaborator) {
      const roleLabel =
        newRole === "spouse"
          ? "Spouse"
          : newRole === "family"
          ? "Family Member"
          : "Wedding Planner";
      toast.success(`Changed ${collaborator.email}'s role to ${roleLabel}`);
    }
  };

  const deleteCollaboratorMutation = useMutation({
    mutationFn: async (collaboratorId: string) => {
      const res = await fetch("/api/permissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collaboratorId }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to remove collaborator");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Collaborator removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleRemoveCollaborator = (collaboratorId: string) => {
    if (!data) return;
    deleteCollaboratorMutation.mutate(collaboratorId);
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const { currentUser, collaborators, invitations } = data;

  const roleLabels = {
    spouse: "Spouse",
    family: "Family Member",
    planner: "Wedding Planner",
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
            isSubmitting={inviteUserMutation.isPending}
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

          {collaborators.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                Collaborators
              </h2>
              <ul className="space-y-3">
                {collaborators.map((collaborator) => (
                  <li
                    key={collaborator.id}
                    className="rounded-xl bg-white border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate text-gray-900">
                          {collaborator.email}
                        </h3>
                        <div className="flex gap-3 mt-2 flex-wrap items-center">
                          <span className="text-sm text-gray-600">
                            {roleLabels[collaborator.role]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select
                          value={collaborator.role}
                          onValueChange={(value: UserRole) =>
                            handleCollaboratorRoleChange(collaborator.id, value)
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="spouse">Spouse</SelectItem>
                            <SelectItem value="family">
                              Family Member
                            </SelectItem>
                            <SelectItem value="planner">
                              Wedding Planner
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-2"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleRemoveCollaborator(collaborator.id)
                              }
                            >
                              Remove Collaborator
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-600 font-medium">
                      <p>
                        Joined:{" "}
                        {new Date(collaborator.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {invitations.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                Invitations
              </h2>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

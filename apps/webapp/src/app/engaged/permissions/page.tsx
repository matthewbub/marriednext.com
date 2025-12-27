"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationTeamPermissions,
  type Role,
} from "component-shelf";
import { fetchShell } from "fetch-shelf";
import {
  transformShellToUserData,
  transformShellToWeddingData,
} from "transformer-shelf";

const permissionsSchema = z.object({
  user: z.object({
    fullName: z.string(),
    imageUrl: z.string().nullable(),
    initials: z.string(),
    email: z.string(),
  }),
  wedding: z.object({
    displayName: z.string(),
    nameA: z.string(),
    nameB: z.string(),
    eventDate: z.string().nullable(),
  }),
  subscriptionPlan: z.string(),
  currentUser: z.object({
    email: z.string(),
    role: z.enum(["spouse", "family_member", "wedding_planner"]),
  }),
  collaborators: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      role: z.enum(["spouse", "family_member", "wedding_planner"]),
      joinedAt: z.string(),
    })
  ),
  invitations: z.array(
    z.object({
      id: z.string(),
      email: z.string(),
      role: z.enum(["spouse", "family_member", "wedding_planner"]),
      status: z.string(),
      sentAt: z.string(),
    })
  ),
});

type PermissionsResponse = z.infer<typeof permissionsSchema>;

async function fetchPermissions(): Promise<PermissionsResponse> {
  const res = await fetch("/api/v2/engaged/permissions");
  if (!res.ok) {
    throw new Error("Failed to fetch permissions data");
  }
  const data = await res.json();
  return permissionsSchema.parse(data);
}

async function inviteCollaborator(payload: { email: string; role: Role }) {
  const res = await fetch("/api/v2/engaged/permissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to invite collaborator");
  }
  return res.json();
}

async function removeCollaborator(payload: {
  collaboratorId?: string;
  invitationId?: string;
}) {
  const res = await fetch("/api/v2/engaged/permissions", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to remove collaborator");
  }
  return res.json();
}

async function updateRoles(payload: {
  currentUser?: { role: Role };
  collaborators?: { id: string; role: Role }[];
  invitations?: { id: string; role: Role }[];
}) {
  const res = await fetch("/api/v2/engaged/permissions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to update roles");
  }
  return res.json();
}

export default function PermissionsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  const { data: shellData } = useQuery({
    queryKey: ["shell"],
    queryFn: fetchShell,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

  const inviteMutation = useMutation({
    mutationFn: inviteCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeCollaborator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: updateRoles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  const userData = shellData ? transformShellToUserData(shellData) : undefined;
  const weddingData = shellData
    ? transformShellToWeddingData(shellData)
    : undefined;

  const handleInvite = (email: string, role: Role) => {
    inviteMutation.reset();
    inviteMutation.mutate({ email, role });
  };

  const handleRemove = (collaboratorId: string) => {
    removeMutation.mutate({ collaboratorId });
  };

  const handleRevokeInvitation = (invitationId: string) => {
    removeMutation.mutate({ invitationId });
  };

  const handleRoleChange = (collaboratorId: string, newRole: Role) => {
    roleChangeMutation.mutate({
      collaborators: [{ id: collaboratorId, role: newRole }],
    });
  };

  const handleInvitationRoleChange = (invitationId: string, newRole: Role) => {
    roleChangeMutation.mutate({
      invitations: [{ id: invitationId, role: newRole }],
    });
  };

  const handleUserRoleChange = (newRole: Role) => {
    roleChangeMutation.mutate({ currentUser: { role: newRole } });
  };

  const currentUser = data
    ? {
        email: data.currentUser.email,
        role: data.currentUser.role,
      }
    : {
        email: "",
        role: "spouse" as Role,
      };

  return (
    <ApplicationDashboardLayout
      user={userData}
      wedding={weddingData}
      Link={Link}
      pathname={pathname}
      onLogout={() => signOut({ redirectUrl: "/" })}
      onInviteClick={() => router.push("/engaged/permissions")}
    >
      <ApplicationTeamPermissions
        currentUser={currentUser}
        collaborators={data?.collaborators ?? []}
        pendingInvitations={data?.invitations ?? []}
        onInvite={handleInvite}
        onRemove={handleRemove}
        onRevokeInvitation={handleRevokeInvitation}
        onRoleChange={handleRoleChange}
        onInvitationRoleChange={handleInvitationRoleChange}
        onUserRoleChange={handleUserRoleChange}
        isInviting={inviteMutation.isPending}
        isRemoving={removeMutation.isPending}
        isLoading={isLoading}
        inviteError={inviteMutation.error?.message ?? null}
      />
    </ApplicationDashboardLayout>
  );
}

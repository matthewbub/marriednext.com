"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationTeamPermissions,
  type Collaborator,
  type Role,
  DashboardUserData,
  DashboardWeddingData,
} from "component-shelf";

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

function transformToUserData(response: PermissionsResponse): DashboardUserData {
  return {
    fullName: response.user.fullName,
    email: response.user.email,
    imageUrl: response.user.imageUrl,
    initials: response.user.initials,
    subscriptionPlan: response.subscriptionPlan,
  };
}

function transformToWeddingData(
  response: PermissionsResponse
): DashboardWeddingData {
  return {
    displayName: response.wedding.displayName,
    nameA: response.wedding.nameA,
    nameB: response.wedding.nameB,
    eventDate: response.wedding.eventDate,
  };
}

export default function PermissionsPage() {
  const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: fetchPermissions,
  });

  const userData = data ? transformToUserData(data) : undefined;
  const weddingData = data ? transformToWeddingData(data) : undefined;

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    if (data && !isLoading) {
      setCollaborators(data.collaborators);
    }
  }, [data, isLoading]);

  const handleInvite = (email: string, role: Role) => {
    const newCollaborator: Collaborator = {
      id: `collab-${Date.now()}`,
      email,
      role,
      joinedAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setCollaborators([...collaborators, newCollaborator]);
  };

  const handleRemove = (collaboratorId: string) => {
    setCollaborators(collaborators.filter((c) => c.id !== collaboratorId));
  };

  const handleRoleChange = (collaboratorId: string, newRole: Role) => {
    setCollaborators(
      collaborators.map((c) =>
        c.id === collaboratorId ? { ...c, role: newRole } : c
      )
    );
  };

  const handleUserRoleChange = (newRole: Role) => {
    console.log("User role changed to:", newRole);
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
    >
      <ApplicationTeamPermissions
        currentUser={currentUser}
        collaborators={collaborators}
        onInvite={handleInvite}
        onRemove={handleRemove}
        onRoleChange={handleRoleChange}
        onUserRoleChange={handleUserRoleChange}
      />
    </ApplicationDashboardLayout>
  );
}

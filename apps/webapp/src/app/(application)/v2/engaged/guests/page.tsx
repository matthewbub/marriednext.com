"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationGuestListManager,
  DashboardUserData,
  DashboardWeddingData,
  GuestListInvitation,
  AddInvitationPayload,
  useAddInvitationDialogStore,
} from "component-shelf";

const guestSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAttending: z.boolean().nullable(),
  hasPlusOne: z.boolean(),
});

const invitationSchema = z.object({
  id: z.string(),
  groupName: z.string(),
  email: z.string().nullable(),
  guests: z.array(guestSchema),
});

const guestListResponseSchema = z.object({
  invitations: z.array(invitationSchema),
  rsvpLink: z.string(),
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
});

type GuestListResponse = z.infer<typeof guestListResponseSchema>;

async function fetchGuestList(): Promise<GuestListResponse> {
  const res = await fetch("/api/v2/engaged/guests");
  if (!res.ok) {
    throw new Error("Failed to fetch guest list");
  }
  const data = await res.json();
  return guestListResponseSchema.parse(data);
}

function transformToUserData(response: GuestListResponse): DashboardUserData {
  return {
    fullName: response.user.fullName,
    email: response.user.email,
    imageUrl: response.user.imageUrl,
    initials: response.user.initials,
    subscriptionPlan: response.subscriptionPlan,
  };
}

function transformToWeddingData(
  response: GuestListResponse
): DashboardWeddingData {
  return {
    displayName: response.wedding.displayName,
    nameA: response.wedding.nameA,
    nameB: response.wedding.nameB,
    eventDate: response.wedding.eventDate,
  };
}

function transformToInvitations(
  response: GuestListResponse
): GuestListInvitation[] {
  return response.invitations.map((inv) => ({
    id: inv.id,
    groupName: inv.groupName,
    email: inv.email,
    guests: inv.guests.map((g) => ({
      id: g.id,
      name: g.name,
      isAttending: g.isAttending,
      hasPlusOne: g.hasPlusOne,
    })),
  }));
}

async function addInvitation(payload: AddInvitationPayload): Promise<void> {
  const res = await fetch("/api/v2/engaged/guests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to add invitation");
  }
}

async function deleteInvitation(invitationId: string): Promise<void> {
  const res = await fetch("/api/v2/engaged/guests/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ invitationId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete invitation");
  }
}

export default function GuestsPage() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { closeDialog } = useAddInvitationDialogStore();

  const { data, isLoading } = useQuery({
    queryKey: ["guest-list"],
    queryFn: fetchGuestList,
  });

  const addInvitationMutation = useMutation({
    mutationFn: addInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
      closeDialog();
    },
  });

  const deleteInvitationMutation = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
  });

  const userData = data ? transformToUserData(data) : undefined;
  const weddingData = data ? transformToWeddingData(data) : undefined;
  const invitations = data ? transformToInvitations(data) : undefined;
  const rsvpLink = data?.rsvpLink;

  return (
    <ApplicationDashboardLayout
      user={userData}
      wedding={weddingData}
      Link={Link}
      pathname={pathname}
    >
      <ApplicationGuestListManager
        invitations={invitations}
        isLoading={isLoading}
        rsvpLink={rsvpLink}
        onAddInvitation={(payload) => addInvitationMutation.mutate(payload)}
        isAddingInvitation={addInvitationMutation.isPending}
        onDeleteInvitation={(invitationId) =>
          deleteInvitationMutation.mutate(invitationId)
        }
        isDeletingInvitation={deleteInvitationMutation.isPending}
      />
    </ApplicationDashboardLayout>
  );
}

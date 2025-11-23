"use client";

import { useMutation } from "@tanstack/react-query";
import { useRsvpStore } from "@/stores/rsvpStore";
import type { InvitationLookupResponse, RsvpApiResponse } from "@/types/rsvp";
import RsvpForm from "./RsvpForm";

interface RsvpFormContainerProps {
  className?: string;
  variant?: "tenant" | "legacy";
}

export default function RsvpFormContainer({
  className,
  variant,
}: RsvpFormContainerProps) {
  const {
    email,
    selectedGuests,
    invitation,
    setInvitation,
    setStep,
    setLoading,
    setError,
  } = useRsvpStore();

  const lookupMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/tenant/rsvp/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to find invitation");
      }

      return res.json() as Promise<InvitationLookupResponse>;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data) => {
      setInvitation(data.invitation, data.nameFormat);
      setStep("guest-selection");
      setLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!invitation) throw new Error("No invitation found");

      const res = await fetch("/api/tenant/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationId: invitation.id,
          email,
          guests: selectedGuests,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit RSVP");
      }

      return res.json() as Promise<RsvpApiResponse>;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setStep("success");
      setLoading(false);
    },
    onError: (error: Error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  return (
    <RsvpForm
      className={className}
      variant={variant}
      onLookup={(name) => lookupMutation.mutate(name)}
      onSubmit={() => submitMutation.mutate()}
    />
  );
}

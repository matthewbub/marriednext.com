"use client";

import { useRouter } from "next/navigation";
import { InviteAcceptance } from "@/components/invite/InviteAcceptance";
import { useQuery, useMutation } from "@tanstack/react-query";

interface InvitePageProps {
  params: {
    id: string;
  };
}

interface InviteData {
  id: string;
  senderEmail: string;
  role: string;
  weddingCouple: string;
  message?: string;
}

export default function InvitePage({ params }: InvitePageProps) {
  const router = useRouter();

  const { data, isLoading } = useQuery<InviteData>({
    queryKey: ["collaborators-invitation", params.id],
    queryFn: async () => {
      const res = await fetch(`/api/collaborators-invitation?id=${params.id}`);
      return res.json();
    },
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/collaborators-invitation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, action: "accept" }),
      });
      return res.json();
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/engaged");
      }, 1500);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/collaborators-invitation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, action: "reject" }),
      });
      return res.json();
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });

  const handleAccept = async () => {
    await acceptMutation.mutateAsync();
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync();
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <InviteAcceptance
      inviteId={params.id}
      senderEmail={data.senderEmail}
      role={data.role}
      weddingCouple={data.weddingCouple}
      message={data.message}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
}

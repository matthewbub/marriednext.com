"use client";

import { useRouter } from "next/navigation";
import { InviteAcceptance } from "@/components/invite/InviteAcceptance";

interface InvitePageProps {
  params: {
    id: string;
  };
}

export default function InvitePage({ params }: InvitePageProps) {
  const router = useRouter();

  const mockInvite = {
    senderEmail: "bride@example.com",
    role: "family",
    weddingCouple: "Sarah & John",
    message: "Would love for you to help us plan our special day!",
  };

  const handleAccept = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeout(() => {
      router.push("/engaged");
    }, 1500);
  };

  const handleReject = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <InviteAcceptance
      inviteId={params.id}
      senderEmail={mockInvite.senderEmail}
      role={mockInvite.role}
      weddingCouple={mockInvite.weddingCouple}
      message={mockInvite.message}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
}

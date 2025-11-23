"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface InviteAcceptanceProps {
  inviteId: string;
  senderEmail: string;
  role: string;
  invitedEmail: string;
  message?: string;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

export function InviteAcceptance({
  inviteId,
  senderEmail,
  role,
  invitedEmail,
  message,
  onAccept,
  onReject,
}: InviteAcceptanceProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await onAccept();
      toast.success("Invitation accepted! Redirecting...");
      setIsProcessed(true);
    } catch (error) {
      toast.error("Failed to accept invitation");
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await onReject();
      toast.success("Invitation declined");
      setIsProcessed(true);
    } catch (error) {
      toast.error("Failed to decline invitation");
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    if (role === "spouse") return "Spouse";
    if (role === "family") return "Family Member";
    if (role === "planner") return "Wedding Planner";
    return role;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md border border-white/20 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're Invited!
          </h1>
          <p className="text-gray-600 text-lg">{invitedEmail}</p>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Invited by</p>
          <p className="text-lg font-semibold text-gray-900">{senderEmail}</p>

          <p className="text-sm text-gray-600 mt-3 mb-1">Role</p>
          <p className="text-lg font-semibold text-gray-900">
            {getRoleLabel(role)}
          </p>

          {message && (
            <>
              <p className="text-sm text-gray-600 mt-3 mb-1">Message</p>
              <p className="text-gray-700 italic">"{message}"</p>
            </>
          )}
        </div>

        {!isProcessed && (
          <div className="space-y-3">
            <Button
              onClick={handleAccept}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Processing..." : "Accept Invitation"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              Decline
            </Button>
          </div>
        )}

        {isProcessed && (
          <div className="text-center py-4">
            <p className="text-gray-600">Redirecting...</p>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          Invitation ID: {inviteId}
        </p>
      </Card>
    </div>
  );
}

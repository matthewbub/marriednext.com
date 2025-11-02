"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface InviteAcceptanceProps {
  inviteId: string;
  senderEmail: string;
  role: string;
  weddingCouple: string;
  message?: string;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

export function InviteAcceptance({
  inviteId,
  senderEmail,
  role,
  weddingCouple,
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're Invited!
          </h1>
          <p className="text-gray-600 text-lg">{weddingCouple}</p>
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
              className="w-full bg-blue-600 hover:bg-blue-700"
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

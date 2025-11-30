"use client";

import "style-shelf/tailwind";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";

const mockInvitations = [
  {
    id: 1,
    invitationName: "The Johnson Family",
    guests: [
      { name: "Sarah Johnson", status: "confirmed" },
      { name: "Mike Johnson", status: "confirmed" },
    ],
  },
  {
    id: 2,
    invitationName: "Chen + Guest",
    guests: [
      { name: "Michael Chen", status: "confirmed" },
      { name: "Guest", status: "pending" },
    ],
  },
  {
    id: 3,
    invitationName: "The Davis Family",
    guests: [
      { name: "Emily Davis", status: "confirmed" },
      { name: "Tom Davis", status: "confirmed" },
      { name: "Lily Davis", status: "declined" },
    ],
  },
  {
    id: 4,
    invitationName: "Wilson Household",
    guests: [
      { name: "David Wilson", status: "declined" },
      { name: "Anna Wilson", status: "declined" },
    ],
  },
  {
    id: 5,
    invitationName: "Martinez Family",
    guests: [
      { name: "Jessica Martinez", status: "confirmed" },
      { name: "Carlos Martinez", status: "confirmed" },
      { name: "Sofia Martinez", status: "confirmed" },
      { name: "Luis Martinez", status: "pending" },
    ],
  },
  {
    id: 6,
    invitationName: "Robert Taylor",
    guests: [{ name: "Robert Taylor", status: "pending" }],
  },
];

const ITEMS_PER_PAGE = 4;

export function RsvpList() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(mockInvitations.length / ITEMS_PER_PAGE);

  const paginatedInvitations = mockInvitations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Check className="h-3.5 w-3.5 text-green-600" />;
      case "declined":
        return <X className="h-3.5 w-3.5 text-red-500" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-amber-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100";
      case "declined":
        return "bg-red-100";
      default:
        return "bg-amber-100";
    }
  };

  const getInvitationSummary = (guests: { name: string; status: string }[]) => {
    const confirmed = guests.filter((g) => g.status === "confirmed").length;
    const declined = guests.filter((g) => g.status === "declined").length;
    const pending = guests.filter((g) => g.status === "pending").length;
    return { confirmed, declined, pending, total: guests.length };
  };

  return (
    <div className="rounded-xl bg-[#f5f3eb] p-6 border border-[#2c2c2c]/10">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl text-[#2c2c2c]">Guest List</h2>
        <a href="/dashboard/rsvp">
          <Button
            variant="ghost"
            className="text-[#745656] hover:bg-[#745656]/10 font-sans text-base gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>
      </div>

      <div className="space-y-3">
        {paginatedInvitations.map((invitation) => {
          const summary = getInvitationSummary(invitation.guests);
          return (
            <div
              key={invitation.id}
              className="bg-white/60 rounded-lg px-4 py-4"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-sans text-base font-medium text-[#2c2c2c]">
                  {invitation.invitationName}
                </p>
                <span className="font-sans text-sm text-[#2c2c2c]/50">
                  {summary.total} {summary.total === 1 ? "guest" : "guests"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {invitation.guests.map((guest, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${getStatusBg(
                      guest.status
                    )}`}
                  >
                    {getStatusIcon(guest.status)}
                    <span className="font-sans text-sm text-[#2c2c2c]/80">
                      {guest.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#2c2c2c]/10">
        <span className="font-sans text-sm text-[#2c2c2c]/60">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9 text-[#2c2c2c] hover:bg-[#2c2c2c]/10 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9 text-[#2c2c2c] hover:bg-[#2c2c2c]/10 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  User,
  Check,
  X,
  Trash2,
  Edit,
  Save,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { Guest, Invitation, RSVPStatus } from "@/lib/types";

type GuestEntry = [string] | [string, string];

// todo move to server
function mapInvitationsToEntries(
  invitations: Invitation[],
  guests: Guest[]
): GuestEntry[] {
  const byInvitationId = new Map<number, Guest[]>();

  // Group guests by invitation ID
  for (const guest of guests) {
    const list = byInvitationId.get(guest.invitation_id) || [];
    list.push(guest);
    byInvitationId.set(guest.invitation_id, list);
  }

  // Map invitations to entries
  return invitations.map((inv) => {
    const related = byInvitationId.get(inv.id) || [];
    if (related.length === 0) {
      return [inv.invitation_name];
    }
    if (related.length === 1) {
      return [related[0].name];
    }

    const primaryGuest =
      related.find((g) => !g.is_plus_one)?.name || related[0].name;
    const hasPlusOne = related.some((g) => g.is_plus_one);
    if (hasPlusOne) {
      return [primaryGuest, "PLUSONE"];
    }

    const secondGuest = related.find((g) => g.name !== primaryGuest)?.name;
    return secondGuest ? [primaryGuest, secondGuest] : [primaryGuest];
  });
}

function getEntryDisplay(entry: GuestEntry) {
  const [first, second] = entry;
  if (second) {
    return second === "PLUSONE" ? `${first} + Guest` : `${first} & ${second}`;
  }
  return first;
}

function getEntryIcon(entry: GuestEntry) {
  const [, second] = entry;
  if (second) {
    return second === "PLUSONE" ? (
      <UserPlus className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    );
  }
  return <User className="h-4 w-4" />;
}

function getCounts(guests: Guest[]): {
  attendingCount: number;
  notAttendingCount: number;
  pendingCount: number;
} {
  const attendingCount = guests.filter(
    (guest) => guest.rsvp_status === "yes"
  ).length;
  const notAttendingCount = guests.filter(
    (guest) => guest.rsvp_status === "no"
  ).length;
  const pendingCount = guests.filter(
    (guest) => guest.rsvp_status === "pending"
  ).length;

  return { attendingCount, notAttendingCount, pendingCount };
}

export default function GuestList({
  invitations,
  guests,
}: {
  invitations: Invitation[];
  guests: Guest[];
}) {
  const [editingInvite, setEditingInvite] = useState<number | null>(null);
  const [localGuests, setLocalGuests] = useState<Guest[]>(guests);

  useEffect(() => {
    setLocalGuests(guests);
  }, [guests]);

  const entries = mapInvitationsToEntries(invitations, localGuests);
  const { attendingCount, notAttendingCount, pendingCount } =
    getCounts(localGuests);

  function cycleStatus(status: RSVPStatus): RSVPStatus {
    if (status === "pending") return "yes";
    if (status === "yes") return "no";
    return "pending";
  }

  async function updateGuestStatus(guestId: number, nextStatus: RSVPStatus) {
    // optimistic update
    setLocalGuests((prev) =>
      prev.map((g) =>
        g.id === guestId ? { ...g, rsvp_status: nextStatus } : g
      )
    );

    try {
      const res = await fetch("/api/guest-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId, rsvp_status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to update RSVP");
    } catch {
      // revert by cycling back
      setLocalGuests((prev) =>
        prev.map((g) =>
          g.id === guestId ? { ...g, rsvp_status: cycleStatus(nextStatus) } : g
        )
      );
    }
  }

  if (!entries) {
    return <div>No entries</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          Wedding Invitation List
        </h1>
        <p className="text-muted-foreground">
          Review your current invitation list
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{attendingCount} Attending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{notAttendingCount} Not Attending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{localGuests.length} Total Guests</span>
          </div>
        </div>
      </div>

      <div>
        <p className="flex items-center justify-between text-lg font-medium mb-4">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Invitation List ({invitations.length} invitations,{" "}
            {localGuests.length} people expected)
          </span>
        </p>

        <div className="space-y-2">
          {entries &&
            entries.map((entry, index) => {
              // const inviteId = entry[0];
              // // const inviteName = entry.invitation_name;
              // const uniqueGuestsOnSingleInvitation = guests.filter(
              //   (guest) => guest.invitation_id === inviteId
              // );
              // const inviteRSVP = uniqueGuestsOnSingleInvitation.map(
              //   (guest) => guest.rsvp_status
              // );

              // const isEditing = editingInvite === index;
              // const inviteRSVP = rsvpStatus[index];
              const displayName = getEntryDisplay(entry);
              const icon = getEntryIcon(entry);
              const invitationForIndex = invitations[index];
              const uniqueGuestsOnSingleInvitation = localGuests.filter(
                (guest) => guest.invitation_id === invitationForIndex.id
              );

              const isEditing = editingInvite === index;
              return (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {!isEditing ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {icon}
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{displayName}</span>
                          {uniqueGuestsOnSingleInvitation.length > 0 && (
                            <div className="flex gap-1">
                              {uniqueGuestsOnSingleInvitation.map(
                                (guest, guestIndex) => {
                                  const status = guest.rsvp_status || "pending";
                                  const guestLabel = guest.is_plus_one
                                    ? "Plus One"
                                    : guest.name;
                                  const next = cycleStatus(status);
                                  return (
                                    <span
                                      key={guestIndex}
                                      onClick={() =>
                                        updateGuestStatus(guest.id, next)
                                      }
                                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full cursor-pointer hover:opacity-80 ${
                                        status === "yes"
                                          ? "bg-green-100 text-green-800"
                                          : status === "no"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                      aria-label={`Set ${guestLabel} RSVP to ${next}`}
                                    >
                                      {status === "yes" && (
                                        <Check className="h-3 w-3" />
                                      )}
                                      {status === "no" && (
                                        <X className="h-3 w-3" />
                                      )}
                                      {guestLabel}: {status}
                                    </span>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingInvite(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this invite?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the invite and its RSVP
                                statuses. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                              // onClick={() => removeGuestEntry(index)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {icon}
                          <span className="font-medium">{displayName}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingInvite(null)}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2 pl-6">
                        {uniqueGuestsOnSingleInvitation.map(
                          (guest, guestIndex) => {
                            const currentStatus: RSVPStatus =
                              guest.rsvp_status || "pending";
                            const guestLabel = guest.is_plus_one
                              ? "Plus One"
                              : guest.name;
                            return (
                              <div
                                key={guestIndex}
                                className="flex items-center gap-3"
                              >
                                <span className="min-w-0 flex-1 text-sm font-medium">
                                  {guestLabel}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant={
                                      currentStatus === "yes"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      updateGuestStatus(guest.id, "yes")
                                    }
                                    className="text-xs"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Attending
                                  </Button>
                                  <Button
                                    variant={
                                      currentStatus === "no"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      updateGuestStatus(guest.id, "no")
                                    }
                                    className="text-xs"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Not Attending
                                  </Button>
                                  <Button
                                    variant={
                                      currentStatus === "pending"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      updateGuestStatus(guest.id, "pending")
                                    }
                                    className="text-xs"
                                  >
                                    Pending
                                  </Button>
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

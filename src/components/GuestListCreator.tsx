"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Users,
  UserPlus,
  User,
  Heart,
  Check,
  Edit,
  X,
  Save,
} from "lucide-react";

type GuestEntry =
  | [string] // Single guest
  | [string, string]; // Two guests or guest + PLUSONE

type GuestRSVPStatus = "attending" | "not-attending" | "pending";

type InviteRSVPStatus = {
  guests: GuestRSVPStatus[];
};

const initialGuestList: GuestEntry[] = [
  ["Ken Bub", "Terri Bub"],
  ["Jordan Bub", "Harlie Bub"],
  ["Letty Vasquez", "Brandy Osborne"],
  ["Ezequiel Vasquez", "Shayna"],
  ["Javier Vasquez", "PLUSONE"],
  ["Johnny Vega"],
  ["Daniel Vega", "Daisy Vega"],
  ["Hunter Tate"],
  ["Zach Bellah"],
  ["Tyler Ehret", "PLUSONE"],
  ["Jessica Ehret", "PLUSONE"],
  ["Barbara", "PLUSONE"],
  ["Jim Ehret", "PLUSONE"],
  ["Evelynn Medina", "PLUSONE"],
  ["Elia", "Ofe"],
  ["Greg Earnest", "Frida"],
  ["John Wattson", "PLUSONE"],
  ["Kathleen", "PLUSONE"],
  ["Cheri", "PLUSONE"],
  ["Illiana", "PLUSONE"],
  ["Dulce", "PLUSONE"],
  ["Lisa Bub", "PLUSONE"],
  ["Teri Shoda", "PLUSONE"],
  ["Sydney Shoda", "PLUSONE"],
  ["Taylor Shoda", "PLUSONE"],
  ["Josh Stevenson", "PLUSONE"],
  ["Hannah Stevenson", "Isaac"],
  ["David Stevenson", "Vickie Stevenson"],
  ["Ryan Stevenson", "PLUSONE"],
  ["Lauren", "Cody"],
  ["Tim Stevenson", "Denise Stevenson"],
  ["Mike Stevenson", "Judy"],
  ["Chuck", "Ricky"],
  ["Granny", "Poppy"],
];

export default function GuestListCreator() {
  const [guestList, setGuestList] = useState<GuestEntry[]>(initialGuestList);
  const [rsvpStatus, setRsvpStatus] = useState<
    Record<number, InviteRSVPStatus>
  >({});
  const [editingInvite, setEditingInvite] = useState<number | null>(null);
  const [inviteType, setInviteType] = useState<"single" | "couple" | "plusone">(
    "single"
  );
  const [primaryName, setPrimaryName] = useState("");
  const [secondaryName, setSecondaryName] = useState("");

  const inviteOptions = [
    {
      value: "single",
      label: "Just one person",
      description: "Inviting one specific person",
      example: "Sarah Johnson",
    },
    {
      value: "couple",
      label: "A couple",
      description: "Two people coming together",
      example: "Sarah Johnson & Mike Smith",
    },
    {
      value: "plusone",
      label: "Someone who can bring a guest",
      description: "One person who can bring anyone they want",
      example: "Sarah Johnson + Guest",
    },
  ];

  const addGuestEntry = () => {
    if (!primaryName.trim()) return;

    let newEntry: GuestEntry;

    switch (inviteType) {
      case "single":
        newEntry = [primaryName.trim()];
        break;
      case "couple":
        if (!secondaryName.trim()) return;
        newEntry = [primaryName.trim(), secondaryName.trim()];
        break;
      case "plusone":
        newEntry = [primaryName.trim(), "PLUSONE"];
        break;
      default:
        return;
    }

    setGuestList([...guestList, newEntry]);
    setPrimaryName("");
    setSecondaryName("");
  };

  const removeGuestEntry = (index: number) => {
    setGuestList(guestList.filter((_, i) => i !== index));
    const newRsvpStatus = { ...rsvpStatus };
    delete newRsvpStatus[index];
    setRsvpStatus(newRsvpStatus);
  };

  const getGuestNamesFromEntry = (entry: GuestEntry): string[] => {
    const [first, second] = entry;
    const names: string[] = [first];
    if (second) {
      names.push(second === "PLUSONE" ? "Plus One" : second);
    }
    return names;
  };

  const initializeRSVPForInvite = (index: number) => {
    if (!rsvpStatus[index]) {
      const entry = guestList[index];
      const guestNames = getGuestNamesFromEntry(entry);
      setRsvpStatus((prev) => ({
        ...prev,
        [index]: {
          guests: guestNames.map(() => "pending" as GuestRSVPStatus),
        },
      }));
    }
  };

  const updateGuestRSVP = (
    inviteIndex: number,
    guestIndex: number,
    status: GuestRSVPStatus
  ) => {
    setRsvpStatus((prev) => {
      const current = prev[inviteIndex] || { guests: [] };
      const newGuests = [...current.guests];
      newGuests[guestIndex] = status;

      return {
        ...prev,
        [inviteIndex]: {
          guests: newGuests,
        },
      };
    });
  };

  const startEditingInvite = (index: number) => {
    initializeRSVPForInvite(index);
    setEditingInvite(index);
  };

  const stopEditingInvite = () => {
    setEditingInvite(null);
  };

  const getEntryDisplay = (entry: GuestEntry) => {
    const [first, second] = entry;
    if (second) {
      return second === "PLUSONE" ? `${first} + Guest` : `${first} & ${second}`;
    }
    return first;
  };

  const getEntryIcon = (entry: GuestEntry) => {
    const [, second] = entry;
    if (second) {
      return second === "PLUSONE" ? (
        <UserPlus className="h-4 w-4" />
      ) : (
        <Users className="h-4 w-4" />
      );
    }
    return <User className="h-4 w-4" />;
  };

  const getTotalGuestCount = () => {
    return guestList.reduce((total, entry) => {
      const [, second] = entry;
      const count = second ? 2 : 1;
      return total + count;
    }, 0);
  };

  const getRsvpStats = () => {
    let attendingCount = 0;
    let notAttendingCount = 0;
    let pendingCount = 0;
    let totalGuests = 0;

    guestList.forEach((entry, index) => {
      const guestNames = getGuestNamesFromEntry(entry);
      totalGuests += guestNames.length;

      const inviteRSVP = rsvpStatus[index];
      if (inviteRSVP) {
        guestNames.forEach((_, guestIndex) => {
          const status = inviteRSVP.guests[guestIndex] || "pending";
          if (status === "attending") attendingCount++;
          else if (status === "not-attending") notAttendingCount++;
          else pendingCount++;
        });
      } else {
        pendingCount += guestNames.length;
      }
    });

    return {
      attendingCount,
      notAttendingCount,
      pendingCount,
      totalGuests,
      totalInvitations: guestList.length,
    };
  };

  const {
    attendingCount,
    notAttendingCount,
    pendingCount,
    totalGuests,
    totalInvitations,
  } = getRsvpStats();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-pink-500" />
          Wedding Guest List
        </h1>
        <p className="text-muted-foreground">
          Build your guest list the way that makes sense for your wedding
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
            <span>{totalGuests} Total Guests</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Guests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">
              How are you inviting them?
            </label>
            <div className="grid gap-3">
              {inviteOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <input
                    type="radio"
                    id={option.value}
                    name="inviteType"
                    value={option.value}
                    checked={inviteType === option.value}
                    onChange={(e) =>
                      setInviteType(
                        e.target.value as "single" | "couple" | "plusone"
                      )
                    }
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label htmlFor={option.value} className="cursor-pointer">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Example: {option.example}
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={primaryName}
                onChange={(e) => setPrimaryName(e.target.value)}
                placeholder={"Sarah Johnson"}
              />
            </div>

            {inviteType === "couple" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Second person&apos;s name
                </label>
                <Input
                  value={secondaryName}
                  onChange={(e) => setSecondaryName(e.target.value)}
                  placeholder={"Mike Smith"}
                />
              </div>
            )}
          </div>

          <Button onClick={addGuestEntry} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add to Guest List
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Guest List ({totalInvitations} invitations,{" "}
              {getTotalGuestCount()} people expected)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {guestList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No guests added yet. Start adding your wedding guests above!
            </p>
          ) : (
            <div className="space-y-2">
              {guestList.map((entry, index) => {
                const guestNames = getGuestNamesFromEntry(entry);
                const isEditing = editingInvite === index;
                const inviteRSVP = rsvpStatus[index];

                return (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {!isEditing ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getEntryIcon(entry)}
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {getEntryDisplay(entry)}
                            </span>
                            {inviteRSVP && (
                              <div className="flex gap-1">
                                {guestNames.map((guestName, guestIndex) => {
                                  const status =
                                    inviteRSVP.guests[guestIndex] || "pending";
                                  return (
                                    <span
                                      key={guestIndex}
                                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                                        status === "attending"
                                          ? "bg-green-100 text-green-800"
                                          : status === "not-attending"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {status === "attending" && (
                                        <Check className="h-3 w-3" />
                                      )}
                                      {status === "not-attending" && (
                                        <X className="h-3 w-3" />
                                      )}
                                      {guestName}: {status.replace("-", " ")}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingInvite(index)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeGuestEntry(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getEntryIcon(entry)}
                            <span className="font-medium">
                              {getEntryDisplay(entry)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={stopEditingInvite}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 pl-6">
                          {guestNames.map((guestName, guestIndex) => {
                            const currentStatus =
                              inviteRSVP?.guests[guestIndex] || "pending";
                            return (
                              <div
                                key={guestIndex}
                                className="flex items-center gap-3"
                              >
                                <span className="min-w-0 flex-1 text-sm font-medium">
                                  {guestName}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant={
                                      currentStatus === "attending"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      updateGuestRSVP(
                                        index,
                                        guestIndex,
                                        "attending"
                                      )
                                    }
                                    className="text-xs"
                                  >
                                    <Check className="h-3 w-3 mr-1" />
                                    Attending
                                  </Button>
                                  <Button
                                    variant={
                                      currentStatus === "not-attending"
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                      updateGuestRSVP(
                                        index,
                                        guestIndex,
                                        "not-attending"
                                      )
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
                                      updateGuestRSVP(
                                        index,
                                        guestIndex,
                                        "pending"
                                      )
                                    }
                                    className="text-xs"
                                  >
                                    Pending
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

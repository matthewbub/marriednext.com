"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Users,
  Search,
  Settings2,
  MoreHorizontal,
  Mail,
  Check,
  X,
  Clock,
  UserPlus,
  Trash2,
  Edit,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  LinkIcon,
  Copy,
} from "lucide-react";
import { AddInvitationDialog } from "./AddInvitationDialog";
import type { AddInvitationPayload } from "./AddInvitationDialog";

type RsvpLookupMethod = "FIRST_NAME_ONLY" | "FULL_NAME" | "EMAIL";

export type GuestListGuest = {
  id: string;
  name: string;
  email?: string;
  isAttending: boolean | null;
  hasPlusOne: boolean;
  plusOneName?: string;
  plusOneAttending?: boolean | null;
  dietaryRestrictions?: string;
};

export type GuestListInvitation = {
  id: string;
  groupName: string;
  email?: string | null;
  guests: GuestListGuest[];
};

export interface ApplicationGuestListManagerProps {
  invitations?: GuestListInvitation[];
  isLoading?: boolean;
  rsvpLink?: string;
  onAddInvitation?: (data: AddInvitationPayload) => void;
  isAddingInvitation?: boolean;
}

const mockInvitations: GuestListInvitation[] = [
  {
    id: "1",
    groupName: "The Johnson Family",
    email: "johnson@email.com",
    guests: [
      {
        id: "1a",
        name: "Robert Johnson",
        isAttending: true,
        hasPlusOne: false,
      },
      { id: "1b", name: "Mary Johnson", isAttending: true, hasPlusOne: false },
      {
        id: "1c",
        name: "Tommy Johnson",
        isAttending: false,
        hasPlusOne: false,
      },
    ],
  },
  {
    id: "2",
    groupName: "Emily Chen",
    email: "emily.chen@email.com",
    guests: [
      {
        id: "2a",
        name: "Emily Chen",
        isAttending: true,
        hasPlusOne: true,
        plusOneName: "David Park",
        plusOneAttending: true,
      },
    ],
  },
  {
    id: "3",
    groupName: "The Williams Couple",
    email: "williams@email.com",
    guests: [
      {
        id: "3a",
        name: "James Williams",
        isAttending: null,
        hasPlusOne: false,
      },
      {
        id: "3b",
        name: "Patricia Williams",
        isAttending: null,
        hasPlusOne: false,
      },
    ],
  },
  {
    id: "4",
    groupName: "Marcus Thompson",
    email: "marcus.t@email.com",
    guests: [
      {
        id: "4a",
        name: "Marcus Thompson",
        isAttending: null,
        hasPlusOne: true,
      },
    ],
  },
  {
    id: "5",
    groupName: "Sarah & Tom Miller",
    email: "millers@email.com",
    guests: [
      { id: "5a", name: "Sarah Miller", isAttending: null, hasPlusOne: false },
      { id: "5b", name: "Tom Miller", isAttending: null, hasPlusOne: false },
    ],
  },
  {
    id: "6",
    groupName: "Jessica Brown",
    guests: [
      { id: "6a", name: "Jessica Brown", isAttending: null, hasPlusOne: false },
    ],
  },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-12" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ApplicationGuestListManager({
  invitations: propInvitations,
  isLoading = false,
  rsvpLink: propRsvpLink,
  onAddInvitation,
  isAddingInvitation = false,
}: ApplicationGuestListManagerProps) {
  const invitations = propInvitations ?? mockInvitations;
  const rsvpLinkValue = propRsvpLink ?? "marriednext.com/rsvp/sarah-michael";

  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [expandedInvitations, setExpandedInvitations] = useState<Set<string>>(
    new Set()
  );
  const [rsvpLookupMethod, setRsvpLookupMethod] =
    useState<RsvpLookupMethod>("FULL_NAME");

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const totalGuests = invitations.reduce((acc, inv) => {
    let count = inv.guests.length;
    inv.guests.forEach((g) => {
      if (g.hasPlusOne && g.plusOneAttending !== false) count++;
    });
    return acc + count;
  }, 0);

  const attendingGuests = invitations.reduce((acc, inv) => {
    let count = inv.guests.filter((g) => g.isAttending === true).length;
    inv.guests.forEach((g) => {
      if (g.isAttending && g.hasPlusOne && g.plusOneAttending === true) count++;
    });
    return acc + count;
  }, 0);

  const declinedGuests = invitations.reduce((acc, inv) => {
    let count = inv.guests.filter((g) => g.isAttending === false).length;
    inv.guests.forEach((g) => {
      if (g.hasPlusOne && g.plusOneAttending === false) count++;
    });
    return acc + count;
  }, 0);

  const pendingGuests = totalGuests - attendingGuests - declinedGuests;

  const respondedInvitations = invitations.filter((i) =>
    i.guests.some((g) => g.isAttending !== null)
  ).length;
  const totalInvitations = invitations.length;

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.guests.some((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      inv.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (attendanceFilter === "all") {
      return matchesSearch;
    }

    const hasMatchingGuest = inv.guests.some((g) => {
      if (attendanceFilter === "confirmed") return g.isAttending === true;
      if (attendanceFilter === "declined") return g.isAttending === false;
      if (attendanceFilter === "not-responded") return g.isAttending === null;
      return true;
    });

    return matchesSearch && hasMatchingGuest;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedInvitations);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedInvitations(newExpanded);
  };

  const getAttendanceIcon = (isAttending: boolean | null) => {
    if (isAttending === true)
      return <Check className="h-4 w-4 text-green-600" />;
    if (isAttending === false) return <X className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Guests & RSVPs
          </h1>
          <p className="text-muted-foreground">
            Manage your guest list, invitations, and track responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <AddInvitationDialog
            onSubmit={onAddInvitation}
            isSubmitting={isAddingInvitation}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Guests</p>
                <p className="text-2xl font-semibold">{totalGuests}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-semibold text-green-600">
                  {attendingGuests}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Declined</p>
                <p className="text-2xl font-semibold text-red-500">
                  {declinedGuests}
                </p>
              </div>
              <X className="h-8 w-8 text-red-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Not Responded</p>
                <p className="text-2xl font-semibold text-amber-600">
                  {pendingGuests}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-semibold">
                  {totalInvitations > 0
                    ? Math.round(
                        (respondedInvitations / totalInvitations) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Your RSVP Link
            </CardTitle>
            <CardDescription>
              Share this link with guests to collect RSVPs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                value={rsvpLinkValue}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 bg-transparent"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              RSVP Settings
            </CardTitle>
            <CardDescription>
              How should guests look up their invitation?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={rsvpLookupMethod}
              onValueChange={(v) => setRsvpLookupMethod(v as RsvpLookupMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIRST_NAME_ONLY">
                  <div className="flex flex-col items-start">
                    <span>First Name Only</span>
                    <span className="text-xs text-muted-foreground">
                      Guests enter just their first name
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="FULL_NAME">
                  <div className="flex flex-col items-start">
                    <span>Full Name</span>
                    <span className="text-xs text-muted-foreground">
                      Guests enter first and last name
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="EMAIL">
                  <div className="flex flex-col items-start">
                    <span>Email Address</span>
                    <span className="text-xs text-muted-foreground">
                      Guests enter their email to find invite
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg font-medium">Invitations</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select
                value={attendanceFilter}
                onValueChange={setAttendanceFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Guests</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="not-responded">Not Responded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleExpanded(invitation.id)}
                >
                  <button className="shrink-0 text-muted-foreground">
                    {expandedInvitations.has(invitation.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {invitation.groupName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({invitation.guests.length}{" "}
                        {invitation.guests.length === 1 ? "guest" : "guests"}
                        {invitation.guests.some((g) => g.hasPlusOne) &&
                          " + plus ones"}
                        )
                      </span>
                    </div>
                    {invitation.email && (
                      <p className="text-sm text-muted-foreground truncate">
                        {invitation.email}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1">
                      {invitation.guests.map((guest) => (
                        <span
                          key={guest.id}
                          title={`${guest.name}: ${
                            guest.isAttending === true
                              ? "Confirmed"
                              : guest.isAttending === false
                              ? "Declined"
                              : "Not Responded"
                          }`}
                        >
                          {getAttendanceIcon(guest.isAttending)}
                        </span>
                      ))}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {invitation.email && (
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Reminder
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedInvitations.has(invitation.id) && (
                  <div className="border-t border-border bg-muted/30 p-3">
                    <div className="space-y-2">
                      {invitation.guests.map((guest) => (
                        <div key={guest.id}>
                          <div className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-background transition-colors">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                              {guest.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">
                                {guest.name}
                              </p>
                              {guest.dietaryRestrictions && (
                                <p className="text-xs text-muted-foreground">
                                  Diet: {guest.dietaryRestrictions}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {guest.isAttending === true && (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Confirmed
                                </Badge>
                              )}
                              {guest.isAttending === false && (
                                <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                                  Declined
                                </Badge>
                              )}
                              {guest.isAttending === null && (
                                <Badge variant="secondary">Not Responded</Badge>
                              )}
                            </div>
                          </div>
                          {guest.hasPlusOne && (
                            <div className="flex items-center gap-3 py-1.5 px-2 ml-6 rounded-md hover:bg-background transition-colors">
                              <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground">
                                <UserPlus className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm">
                                  {guest.plusOneName || "Plus One"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Guest of {guest.name.split(" ")[0]}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {guest.plusOneAttending === true && (
                                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                    Confirmed
                                  </Badge>
                                )}
                                {guest.plusOneAttending === false && (
                                  <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                                    Declined
                                  </Badge>
                                )}
                                {guest.plusOneAttending === undefined &&
                                  guest.isAttending !== false && (
                                    <Badge variant="secondary">
                                      Not Responded
                                    </Badge>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredInvitations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No invitations found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

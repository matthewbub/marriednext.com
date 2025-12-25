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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
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
  ChevronDown,
  ChevronRight,
  UserCircle,
  Type,
} from "lucide-react";
import { AddInvitationDialog } from "./AddInvitationDialog";
import type { AddInvitationPayload } from "./AddInvitationDialog";
import { EditInvitationDialog } from "./EditInvitationDialog";
import { useEditInvitationDialogStore } from "../../../stores/editInvitationDialogStore";
import { RsvpProgress } from "./RsvpProgress";

export type RsvpLookupMethod = "FIRST_NAME_ONLY" | "FULL_NAME" | "EMAIL";

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

export type GuestListStats = {
  totalGuests: number;
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  totalInvitations: number;
};

export interface ApplicationGuestListManagerProps {
  invitations?: GuestListInvitation[];
  stats?: GuestListStats;
  isLoading?: boolean;
  rsvpLink?: string;
  onAddInvitation?: (data: AddInvitationPayload) => void;
  isAddingInvitation?: boolean;
  onEditInvitation?: (invitation: GuestListInvitation) => void;
  isEditingInvitation?: boolean;
  onDeleteInvitation?: (invitationId: string) => void;
  isDeletingInvitation?: boolean;
  rsvpLookupMethod?: RsvpLookupMethod;
  onRsvpLookupMethodChange?: (method: RsvpLookupMethod) => void;
  isUpdatingRsvpLookupMethod?: boolean;
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

export function ApplicationGuestListManager({
  invitations: propInvitations,
  stats: propStats,
  isLoading = false,
  onAddInvitation,
  isAddingInvitation = false,
  onEditInvitation,
  isEditingInvitation = false,
  onDeleteInvitation,
  isDeletingInvitation = false,
  rsvpLookupMethod: propRsvpLookupMethod,
  onRsvpLookupMethodChange,
  isUpdatingRsvpLookupMethod = false,
}: ApplicationGuestListManagerProps) {
  const { openDialog } = useEditInvitationDialogStore();
  const invitations = propInvitations ?? mockInvitations;
  const rsvpLookupMethod = propRsvpLookupMethod ?? "FULL_NAME";

  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<string>("all");
  const [expandedInvitations, setExpandedInvitations] = useState<Set<string>>(
    new Set()
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(
    null
  );

  const fallbackStats = (() => {
    const total = invitations.reduce((acc, inv) => {
      let count = inv.guests.length;
      inv.guests.forEach((g) => {
        if (g.hasPlusOne) count++;
      });
      return acc + count;
    }, 0);
    const attending = invitations.reduce(
      (acc, inv) =>
        acc + inv.guests.filter((g) => g.isAttending === true).length,
      0
    );
    const declined = invitations.reduce(
      (acc, inv) =>
        acc + inv.guests.filter((g) => g.isAttending === false).length,
      0
    );
    return {
      totalGuests: total,
      attendingGuests: attending,
      declinedGuests: declined,
      pendingGuests: total - attending - declined,
      totalInvitations: invitations.length,
    };
  })();

  const {
    totalGuests,
    attendingGuests,
    declinedGuests,
    pendingGuests,
    totalInvitations,
  } = propStats ?? fallbackStats;

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

  const handleDeleteClick = (invitationId: string) => {
    setInvitationToDelete(invitationId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (invitationToDelete && onDeleteInvitation) {
      onDeleteInvitation(invitationToDelete);
    }
    setDeleteDialogOpen(false);
    setInvitationToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setInvitationToDelete(null);
  };

  const invitationToDeleteData = invitationToDelete
    ? invitations.find((inv) => inv.id === invitationToDelete)
    : null;

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
          {/* <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button> */}
          <AddInvitationDialog
            onSubmit={onAddInvitation}
            isSubmitting={isAddingInvitation}
          />
        </div>
      </div>

      <RsvpProgress
        isLoading={isLoading}
        totalInvitations={totalInvitations}
        totalGuests={totalGuests}
        respondedGuests={attendingGuests + declinedGuests}
        responseRate={
          totalGuests > 0
            ? Math.round(
                ((attendingGuests + declinedGuests) / totalGuests) * 100
              )
            : 0
        }
        attendingGuests={attendingGuests}
        declinedGuests={declinedGuests}
        pendingGuests={pendingGuests}
      />

      <div className="">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              RSVP Lookup Method
            </CardTitle>
            <CardDescription>
              How should guests find their invitation when they RSVP?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              {/* First Name Only Option */}
              <button
                onClick={() => onRsvpLookupMethodChange?.("FIRST_NAME_ONLY")}
                disabled={isUpdatingRsvpLookupMethod}
                className={`relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  rsvpLookupMethod === "FIRST_NAME_ONLY"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    rsvpLookupMethod === "FIRST_NAME_ONLY"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Type className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">First Name Only</p>
                  <p className="text-xs text-muted-foreground">
                    Easiest for guests. Duplicates will be asked to clarify.
                  </p>
                </div>
                {rsvpLookupMethod === "FIRST_NAME_ONLY" && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>

              {/* Full Name Option */}
              <button
                onClick={() => onRsvpLookupMethodChange?.("FULL_NAME")}
                disabled={isUpdatingRsvpLookupMethod}
                className={`relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  rsvpLookupMethod === "FULL_NAME"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    rsvpLookupMethod === "FULL_NAME"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <UserCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Full Name</p>
                  <p className="text-xs text-muted-foreground">
                    Recommended. Guests will be asked to enter their full name.
                  </p>
                </div>
                {rsvpLookupMethod === "FULL_NAME" && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>

              {/* Email Option */}
              <button
                onClick={() => onRsvpLookupMethodChange?.("EMAIL")}
                disabled={isUpdatingRsvpLookupMethod}
                className={`relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  rsvpLookupMethod === "EMAIL"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    rsvpLookupMethod === "EMAIL"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-xs text-muted-foreground">
                    Most secure. Guests will be asked to enter their email
                    address.
                  </p>
                </div>
                {rsvpLookupMethod === "EMAIL" && (
                  <div className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            </div>
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
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))
              : filteredInvitations.map((invitation) => (
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
                            {invitation.guests.length === 1
                              ? "guest"
                              : "guests"}
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog({
                                  id: invitation.id,
                                  groupName: invitation.groupName,
                                  email: invitation.email,
                                  guests: invitation.guests.map((g) => ({
                                    id: g.id,
                                    name: g.name,
                                    isAttending: g.isAttending,
                                    hasPlusOne: g.hasPlusOne,
                                  })),
                                });
                              }}
                              disabled={isEditingInvitation}
                            >
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
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(invitation.id);
                              }}
                              disabled={isDeletingInvitation}
                            >
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
                                    <Badge variant="secondary">
                                      Not Responded
                                    </Badge>
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

            {!isLoading && filteredInvitations.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-medium">No invitations found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the invitation for{" "}
              <strong>
                {invitationToDeleteData?.groupName || "this group"}
              </strong>
              ? This will permanently delete the invitation and all associated
              guests. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingInvitation}
            >
              {isDeletingInvitation ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {onEditInvitation && <EditInvitationDialog onSave={onEditInvitation} />}
    </div>
  );
}

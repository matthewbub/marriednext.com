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
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
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
import {
  Users,
  Plus,
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
  Send,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  User,
  LinkIcon,
  Copy,
} from "lucide-react";

type RsvpLookupMethod = "FIRST_NAME_ONLY" | "FULL_NAME" | "EMAIL";

type Guest = {
  id: string;
  name: string;
  email?: string;
  isAttending: boolean | null;
  hasPlusOne: boolean;
  plusOneName?: string;
  plusOneAttending?: boolean | null;
  dietaryRestrictions?: string;
};

type Invitation = {
  id: string;
  groupName: string;
  email?: string;
  guests: Guest[];
  status: "pending" | "sent" | "viewed" | "responded";
  sentAt?: string;
  respondedAt?: string;
};

const mockInvitations: Invitation[] = [
  {
    id: "1",
    groupName: "The Johnson Family",
    email: "johnson@email.com",
    status: "responded",
    sentAt: "2024-11-01",
    respondedAt: "2024-11-05",
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
    status: "responded",
    sentAt: "2024-11-01",
    respondedAt: "2024-11-03",
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
    status: "viewed",
    sentAt: "2024-11-02",
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
    status: "sent",
    sentAt: "2024-11-05",
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
    status: "pending",
    guests: [
      { id: "5a", name: "Sarah Miller", isAttending: null, hasPlusOne: false },
      { id: "5b", name: "Tom Miller", isAttending: null, hasPlusOne: false },
    ],
  },
  {
    id: "6",
    groupName: "Jessica Brown",
    status: "pending",
    guests: [
      { id: "6a", name: "Jessica Brown", isAttending: null, hasPlusOne: false },
    ],
  },
];

export function ApplicationGuestListManager() {
  const [invitations] = useState<Invitation[]>(mockInvitations);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedInvitations, setExpandedInvitations] = useState<Set<string>>(
    new Set()
  );
  const [rsvpLookupMethod, setRsvpLookupMethod] =
    useState<RsvpLookupMethod>("FULL_NAME");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [invitationType, setInvitationType] = useState<
    "single" | "plusone" | "group"
  >("single");

  // Stats calculation
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

  const respondedInvitations = invitations.filter(
    (i) => i.status === "responded"
  ).length;
  const totalInvitations = invitations.length;

  // Filtering
  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.guests.some((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      inv.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
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

  const getStatusBadge = (status: Invitation["status"]) => {
    switch (status) {
      case "responded":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Responded
          </Badge>
        );
      case "viewed":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            Viewed
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Sent
          </Badge>
        );
      case "pending":
        return <Badge variant="secondary">Not Sent</Badge>;
    }
  };

  const getAttendanceIcon = (isAttending: boolean | null) => {
    if (isAttending === true)
      return <Check className="h-4 w-4 text-green-600" />;
    if (isAttending === false) return <X className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const rsvpLink = "marriednext.com/rsvp/sarah-michael";

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Invitation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif">
                  Add New Invitation
                </DialogTitle>
                <DialogDescription>
                  Create an invitation for a single guest, guest with +1, or a
                  group of guests.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Invitation Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={
                        invitationType === "single" ? "default" : "outline"
                      }
                      className="flex-col h-auto py-3 gap-1"
                      onClick={() => setInvitationType("single")}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">Single</span>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        invitationType === "plusone" ? "default" : "outline"
                      }
                      className="flex-col h-auto py-3 gap-1"
                      onClick={() => setInvitationType("plusone")}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="text-xs">Guest +1</span>
                    </Button>
                    <Button
                      type="button"
                      variant={
                        invitationType === "group" ? "default" : "outline"
                      }
                      className="flex-col h-auto py-3 gap-1"
                      onClick={() => setInvitationType("group")}
                    >
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Group</span>
                    </Button>
                  </div>
                </div>

                {invitationType === "group" && (
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      placeholder="e.g., The Smith Family"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="guestName">
                    {invitationType === "group"
                      ? "Guest Names (one per line)"
                      : "Guest Name"}
                  </Label>
                  {invitationType === "group" ? (
                    <textarea
                      id="guestName"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="John Smith&#10;Jane Smith&#10;Jimmy Smith"
                    />
                  ) : (
                    <Input id="guestName" placeholder="Full name" />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guest@email.com"
                  />
                </div>

                {invitationType === "plusone" && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                    <UserPlus className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Plus One Enabled</p>
                      <p className="text-muted-foreground">
                        Guest can bring one additional person
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowAddDialog(false)}>
                  Add Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
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
                <p className="text-sm text-muted-foreground">Attending</p>
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
                <p className="text-sm text-muted-foreground">Awaiting</p>
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
                  {Math.round((respondedInvitations / totalInvitations) * 100)}%
                </p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RSVP Link & Settings */}
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
              <Input value={rsvpLink} readOnly className="font-mono text-sm" />
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

      {/* Guest List */}
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Not Sent</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
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
                {/* Invitation Header Row */}
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
                    {getStatusBadge(invitation.status)}

                    <div className="flex items-center gap-1">
                      {invitation.guests.map((guest) => (
                        <span
                          key={guest.id}
                          title={`${guest.name}: ${
                            guest.isAttending === true
                              ? "Attending"
                              : guest.isAttending === false
                              ? "Declined"
                              : "Pending"
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
                        {invitation.status === "pending" && (
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send Invitation
                          </DropdownMenuItem>
                        )}
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

                {/* Expanded Guest Details */}
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
                                  Attending
                                </Badge>
                              )}
                              {guest.isAttending === false && (
                                <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                                  Declined
                                </Badge>
                              )}
                              {guest.isAttending === null && (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </div>
                          </div>
                          {/* Plus One */}
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
                                    Attending
                                  </Badge>
                                )}
                                {guest.plusOneAttending === false && (
                                  <Badge className="bg-red-100 text-red-600 hover:bg-red-100">
                                    Declined
                                  </Badge>
                                )}
                                {guest.plusOneAttending === undefined &&
                                  guest.isAttending !== false && (
                                    <Badge variant="secondary">Pending</Badge>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {invitation.sentAt && (
                      <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          Sent:{" "}
                          {new Date(invitation.sentAt).toLocaleDateString()}
                        </span>
                        {invitation.respondedAt && (
                          <span>
                            Responded:{" "}
                            {new Date(
                              invitation.respondedAt
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
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

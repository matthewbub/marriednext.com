"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  UserPlus,
  Users,
  Trash2,
  Plus,
  Mail,
  UtensilsCrossed,
  Check,
  X,
  Clock,
} from "lucide-react";

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

interface EditInvitationDialogProps {
  invitation: Invitation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (invitation: Invitation) => void;
}

export function EditInvitationDialog({
  invitation,
  open,
  onOpenChange,
  onSave,
}: EditInvitationDialogProps) {
  const [editedInvitation, setEditedInvitation] = useState<Invitation | null>(
    () =>
      invitation
        ? {
            ...invitation,
            guests: invitation.guests.map((g) => ({ ...g })),
          }
        : null
  );
  const [activeTab, setActiveTab] = useState("details");

  if (!editedInvitation) return null;

  const updateGuest = (guestId: string, updates: Partial<Guest>) => {
    setEditedInvitation({
      ...editedInvitation,
      guests: editedInvitation.guests.map((g) =>
        g.id === guestId ? { ...g, ...updates } : g
      ),
    });
  };

  const addGuest = () => {
    const newGuest: Guest = {
      id: `new-${Date.now()}`,
      name: "",
      isAttending: null,
      hasPlusOne: false,
    };
    setEditedInvitation({
      ...editedInvitation,
      guests: [...editedInvitation.guests, newGuest],
    });
  };

  const removeGuest = (guestId: string) => {
    if (editedInvitation.guests.length <= 1) return;
    setEditedInvitation({
      ...editedInvitation,
      guests: editedInvitation.guests.filter((g) => g.id !== guestId),
    });
  };

  const handleSave = () => {
    onSave(editedInvitation);
    onOpenChange(false);
  };

  const getAttendanceValue = (isAttending: boolean | null): string => {
    if (isAttending === true) return "yes";
    if (isAttending === false) return "no";
    return "pending";
  };

  const parseAttendanceValue = (value: string): boolean | null => {
    if (value === "yes") return true;
    if (value === "no") return false;
    return null;
  };

  const isSingleGuest =
    editedInvitation.guests.length === 1 &&
    !editedInvitation.guests[0].hasPlusOne;
  const isGuestPlusOne =
    editedInvitation.guests.length === 1 &&
    editedInvitation.guests[0].hasPlusOne;
  const isGroup = editedInvitation.guests.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} key={invitation?.id}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            Edit Invitation
            {isSingleGuest && (
              <Badge variant="secondary" className="font-normal">
                <User className="h-3 w-3 mr-1" />
                Single
              </Badge>
            )}
            {isGuestPlusOne && (
              <Badge variant="secondary" className="font-normal">
                <UserPlus className="h-3 w-3 mr-1" />
                +1
              </Badge>
            )}
            {isGroup && (
              <Badge variant="secondary" className="font-normal">
                <Users className="h-3 w-3 mr-1" />
                Group
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Update invitation details and manage guest responses.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="guests">
              Guests ({editedInvitation.guests.length})
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="groupName">Invitation Name</Label>
              <Input
                id="groupName"
                value={editedInvitation.groupName}
                onChange={(e) =>
                  setEditedInvitation({
                    ...editedInvitation,
                    groupName: e.target.value,
                  })
                }
                placeholder="e.g., The Smith Family"
              />
              <p className="text-xs text-muted-foreground">
                This is how the invitation will appear in your list
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={editedInvitation.email || ""}
                  onChange={(e) =>
                    setEditedInvitation({
                      ...editedInvitation,
                      email: e.target.value,
                    })
                  }
                  placeholder="email@example.com"
                  className="pl-9"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Used for sending digital invitations and reminders
              </p>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3 bg-muted/30">
              <h4 className="font-medium text-sm">Invitation Status</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 capitalize">
                    {editedInvitation.status}
                  </span>
                </div>
                {editedInvitation.sentAt && (
                  <div>
                    <span className="text-muted-foreground">Sent:</span>
                    <span className="ml-2">
                      {new Date(editedInvitation.sentAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {editedInvitation.respondedAt && (
                  <div>
                    <span className="text-muted-foreground">Responded:</span>
                    <span className="ml-2">
                      {new Date(
                        editedInvitation.respondedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Guests Tab */}
          <TabsContent value="guests" className="space-y-4 mt-4">
            {editedInvitation.guests.map((guest, index) => (
              <div
                key={guest.id}
                className="rounded-lg border border-border p-4 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                      {guest.name
                        ? guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()
                        : "?"}
                    </div>
                    <div>
                      <p className="font-medium">Guest {index + 1}</p>
                      {guest.hasPlusOne && (
                        <p className="text-xs text-muted-foreground">Has +1</p>
                      )}
                    </div>
                  </div>
                  {editedInvitation.guests.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeGuest(guest.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${guest.id}`}>Full Name</Label>
                    <Input
                      id={`name-${guest.id}`}
                      value={guest.name}
                      onChange={(e) =>
                        updateGuest(guest.id, { name: e.target.value })
                      }
                      placeholder="Guest name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`attendance-${guest.id}`}>
                      RSVP Status
                    </Label>
                    <Select
                      value={getAttendanceValue(guest.isAttending)}
                      onValueChange={(v) =>
                        updateGuest(guest.id, {
                          isAttending: parseAttendanceValue(v),
                        })
                      }
                    >
                      <SelectTrigger id={`attendance-${guest.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            Pending
                          </div>
                        </SelectItem>
                        <SelectItem value="yes">
                          <div className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            Attending
                          </div>
                        </SelectItem>
                        <SelectItem value="no">
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-500" />
                            Declined
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`dietary-${guest.id}`}>
                    Dietary Restrictions
                  </Label>
                  <div className="relative">
                    <UtensilsCrossed className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id={`dietary-${guest.id}`}
                      value={guest.dietaryRestrictions || ""}
                      onChange={(e) =>
                        updateGuest(guest.id, {
                          dietaryRestrictions: e.target.value,
                        })
                      }
                      placeholder="e.g., Vegetarian, Gluten-free"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`plusone-${guest.id}`}
                    checked={guest.hasPlusOne}
                    onChange={(e) =>
                      updateGuest(guest.id, {
                        hasPlusOne: e.target.checked,
                        plusOneName: e.target.checked
                          ? guest.plusOneName
                          : undefined,
                        plusOneAttending: e.target.checked
                          ? guest.plusOneAttending
                          : undefined,
                      })
                    }
                    className="h-4 w-4 rounded border-input"
                  />
                  <Label
                    htmlFor={`plusone-${guest.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    Allow plus one
                  </Label>
                </div>

                {/* Plus One Section */}
                {guest.hasPlusOne && (
                  <div className="ml-4 pl-4 border-l-2 border-border space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      Plus One Details
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`plusone-name-${guest.id}`}>
                          Plus One Name
                        </Label>
                        <Input
                          id={`plusone-name-${guest.id}`}
                          value={guest.plusOneName || ""}
                          onChange={(e) =>
                            updateGuest(guest.id, {
                              plusOneName: e.target.value,
                            })
                          }
                          placeholder="Guest's +1 name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`plusone-attendance-${guest.id}`}>
                          RSVP Status
                        </Label>
                        <Select
                          value={getAttendanceValue(
                            guest.plusOneAttending ?? null
                          )}
                          onValueChange={(v) =>
                            updateGuest(guest.id, {
                              plusOneAttending: parseAttendanceValue(v),
                            })
                          }
                        >
                          <SelectTrigger id={`plusone-attendance-${guest.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                Pending
                              </div>
                            </SelectItem>
                            <SelectItem value="yes">
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600" />
                                Attending
                              </div>
                            </SelectItem>
                            <SelectItem value="no">
                              <div className="flex items-center gap-2">
                                <X className="h-4 w-4 text-red-500" />
                                Declined
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={addGuest}
            >
              <Plus className="h-4 w-4" />
              Add Another Guest
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

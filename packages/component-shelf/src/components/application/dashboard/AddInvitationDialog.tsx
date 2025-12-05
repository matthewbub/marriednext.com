"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { User, UserPlus, Users, Plus, Trash2 } from "lucide-react";
import { useAddInvitationDialogStore } from "../../../stores/addInvitationDialogStore";

export type AddInvitationPayload = {
  guests: string[];
  hasPlusOne: boolean;
  inviteGroupName: string | null;
  email: string | null;
};

interface AddInvitationDialogProps {
  onSubmit?: (data: AddInvitationPayload) => void;
  isSubmitting?: boolean;
}

export function AddInvitationDialog({
  onSubmit,
  isSubmitting = false,
}: AddInvitationDialogProps) {
  const {
    isOpen,
    invitationType,
    openDialog,
    closeDialog,
    setInvitationType,
    reset,
  } = useAddInvitationDialogStore();

  const [groupName, setGroupName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [email, setEmail] = useState("");

  const addGuestName = () => {
    setGuestNames([...guestNames, ""]);
  };

  const removeGuestName = (index: number) => {
    setGuestNames(guestNames.filter((_, i) => i !== index));
  };

  const updateGuestName = (index: number, value: string) => {
    const updated = [...guestNames];
    updated[index] = value;
    setGuestNames(updated);
  };

  const handleClose = () => {
    closeDialog();
    setGroupName("");
    setGuestName("");
    setGuestNames([""]);
    setEmail("");
    reset();
  };

  const handleSubmit = () => {
    const guests =
      invitationType === "group"
        ? guestNames.filter((name) => name.trim() !== "")
        : guestName.trim()
        ? [guestName.trim()]
        : [];

    if (guests.length === 0) {
      return;
    }

    const payload: AddInvitationPayload = {
      guests,
      hasPlusOne: invitationType === "plusone",
      inviteGroupName:
        invitationType === "group" ? groupName.trim() || null : null,
      email: email.trim() || null,
    };

    if (onSubmit) {
      onSubmit(payload);
    } else {
      handleClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? openDialog() : handleClose())}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Invitation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">Add New Invitation</DialogTitle>
          <DialogDescription>
            Create an invitation for a single guest, guest with +1, or a group
            of guests.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Invitation Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={invitationType === "single" ? "default" : "outline"}
                className="flex-col h-auto py-3 gap-1"
                onClick={() => setInvitationType("single")}
              >
                <User className="h-5 w-5" />
                <span className="text-xs">Single</span>
              </Button>
              <Button
                type="button"
                variant={invitationType === "plusone" ? "default" : "outline"}
                className="flex-col h-auto py-3 gap-1"
                onClick={() => setInvitationType("plusone")}
              >
                <UserPlus className="h-5 w-5" />
                <span className="text-xs">Guest +1</span>
              </Button>
              <Button
                type="button"
                variant={invitationType === "group" ? "default" : "outline"}
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
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="guestName">
              {invitationType === "group" ? "Guest Names" : "Guest Name"}
            </Label>
            {invitationType === "group" ? (
              <div className="space-y-2">
                {guestNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      id={`guestName-${index}`}
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => updateGuestName(index, e.target.value)}
                    />
                    {guestNames.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeGuestName(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={addGuestName}
                >
                  <Plus className="h-4 w-4" />
                  Add Guest
                </Button>
              </div>
            ) : (
              <Input
                id="guestName"
                placeholder="Full name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="guest@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

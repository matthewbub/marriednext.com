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
import { User, UserPlus, Users, Plus } from "lucide-react";
import { useAddInvitationDialogStore } from "../../../stores/addInvitationDialogStore";

export function AddInvitationDialog() {
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
  const [email, setEmail] = useState("");

  const handleClose = () => {
    closeDialog();
    setGroupName("");
    setGuestName("");
    setEmail("");
    reset();
  };

  const handleSubmit = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? openDialog() : handleClose())}>
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
              {invitationType === "group"
                ? "Guest Names (one per line)"
                : "Guest Name"}
            </Label>
            {invitationType === "group" ? (
              <textarea
                id="guestName"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="John Smith&#10;Jane Smith&#10;Jimmy Smith"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


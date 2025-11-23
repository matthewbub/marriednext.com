"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InviteUserForm } from "./InviteUserForm";
import { InviteUserFormData } from "./permissions.types";

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InviteUserFormData) => void;
  isSubmitting?: boolean;
}

export function InviteUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: InviteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Collaborator</DialogTitle>
          <DialogDescription>
            Invite someone to help manage your wedding website. All
            collaborators have full admin access to view and edit settings,
            guest lists, and content.
          </DialogDescription>
        </DialogHeader>
        <InviteUserForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}


"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddGuestForm } from "./AddGuestForm";

interface AddGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { guests: string[]; hasPlusOne: boolean }) => void;
  isSubmitting?: boolean;
}

export function AddGuestDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: AddGuestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>Add Guest to List</DialogTitle>
          <DialogDescription>
            Add one or more guests to the invitation list. Each invitation can
            have up to 8 guests.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 pr-2">
          <AddGuestForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

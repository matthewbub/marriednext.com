import { create } from "zustand";

type Guest = {
  id: string;
  name: string;
  isAttending: boolean | null;
  hasPlusOne: boolean;
};

type Invitation = {
  id: string;
  groupName: string;
  email?: string | null;
  guests: Guest[];
};

interface EditInvitationDialogStore {
  isOpen: boolean;
  invitation: Invitation | null;
  openDialog: (invitation: Invitation) => void;
  closeDialog: () => void;
  reset: () => void;
}

export const useEditInvitationDialogStore = create<EditInvitationDialogStore>(
  (set) => ({
    isOpen: false,
    invitation: null,
    openDialog: (invitation) => set({ isOpen: true, invitation }),
    closeDialog: () => set({ isOpen: false }),
    reset: () => set({ isOpen: false, invitation: null }),
  })
);

export type { Guest, Invitation };

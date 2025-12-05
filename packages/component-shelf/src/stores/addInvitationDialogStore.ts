import { create } from "zustand";

type InvitationType = "single" | "plusone" | "group";

interface AddInvitationDialogStore {
  isOpen: boolean;
  invitationType: InvitationType;
  openDialog: () => void;
  closeDialog: () => void;
  setInvitationType: (type: InvitationType) => void;
  reset: () => void;
}

export const useAddInvitationDialogStore = create<AddInvitationDialogStore>(
  (set) => ({
    isOpen: false,
    invitationType: "single",
    openDialog: () => set({ isOpen: true }),
    closeDialog: () => set({ isOpen: false }),
    setInvitationType: (type) => set({ invitationType: type }),
    reset: () => set({ isOpen: false, invitationType: "single" }),
  })
);


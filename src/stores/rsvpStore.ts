import { create } from "zustand";
import {
  RsvpFormState,
  RsvpFormStep,
  GuestSelection,
  RsvpNameFormat,
} from "@/types/rsvp";
import { DbInvitationWithGuests } from "@/database/drizzle";

interface RsvpStore extends RsvpFormState {
  setStep: (step: RsvpFormStep) => void;
  setInputName: (name: string) => void;
  setInvitation: (
    invitation: DbInvitationWithGuests,
    nameFormat: RsvpNameFormat
  ) => void;
  toggleGuest: (guestName: string) => void;
  setEmail: (email: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (errorMessage: string) => void;
  reset: () => void;
}

const initialState: RsvpFormState = {
  step: "name-input",
  inputName: "",
  invitation: null,
  selectedGuests: [],
  email: "",
  nameFormat: "FULL_NAME",
  isLoading: false,
  errorMessage: null,
};

export const useRsvpStore = create<RsvpStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setInputName: (inputName) => set({ inputName }),

  setInvitation: (invitation, nameFormat) => {
    const guests: GuestSelection[] = invitation.guests.map((guest) => ({
      name: guest.nameOnInvitation,
      isAttending: guest.isAttending ?? true,
    }));

    set({
      invitation,
      selectedGuests: guests,
      nameFormat,
    });
  },

  toggleGuest: (guestName) =>
    set((state) => ({
      selectedGuests: state.selectedGuests.map((guest) =>
        guest.name === guestName
          ? { ...guest, isAttending: !guest.isAttending }
          : guest
      ),
    })),

  setEmail: (email) => set({ email }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (errorMessage) => set({ step: "error", errorMessage }),

  reset: () => set(initialState),
}));

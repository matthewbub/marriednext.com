import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import RsvpForm, { InvitationData } from "@/components/RsvpForm";

const meta = {
  title: "Components/RsvpForm",
  component: RsvpForm,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onNameSubmit: fn(),
    onGuestToggle: fn(),
    onEmailSubmit: fn(),
    onStepChange: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof RsvpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const singleGuestInvitation: InvitationData = {
  id: "inv-123",
  guests: [{ name: "John Doe", isAttending: false }],
};

const coupleInvitation: InvitationData = {
  id: "inv-456",
  guests: [
    { name: "John Doe", isAttending: false },
    { name: "Jane Doe", isAttending: false },
  ],
};

const familyInvitation: InvitationData = {
  id: "inv-789",
  guests: [
    { name: "John Doe", isAttending: false },
    { name: "Jane Doe", isAttending: false },
    { name: "Jimmy Doe", isAttending: false },
    { name: "Jenny Doe", isAttending: false },
  ],
};

export const NameInputStep: Story = {
  args: {
    step: "name-input",
    invitation: null,
    selectedGuests: [],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const NameInputFirstNameOnly: Story = {
  args: {
    step: "name-input",
    invitation: null,
    selectedGuests: [],
    email: "",
    nameFormat: "FIRST_NAME_ONLY",
    isLoading: false,
    errorMessage: null,
  },
};

export const GuestSelectionSingle: Story = {
  args: {
    step: "guest-selection",
    invitation: singleGuestInvitation,
    selectedGuests: [{ name: "John Doe", isAttending: false }],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const GuestSelectionCouple: Story = {
  args: {
    step: "guest-selection",
    invitation: coupleInvitation,
    selectedGuests: [
      { name: "John Doe", isAttending: true },
      { name: "Jane Doe", isAttending: true },
    ],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const GuestSelectionFamily: Story = {
  args: {
    step: "guest-selection",
    invitation: familyInvitation,
    selectedGuests: [
      { name: "John Doe", isAttending: true },
      { name: "Jane Doe", isAttending: true },
      { name: "Jimmy Doe", isAttending: false },
      { name: "Jenny Doe", isAttending: true },
    ],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const EmailCollectionStep: Story = {
  args: {
    step: "email-collection",
    invitation: singleGuestInvitation,
    selectedGuests: [{ name: "John Doe", isAttending: true }],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const SuccessStep: Story = {
  args: {
    step: "success",
    invitation: singleGuestInvitation,
    selectedGuests: [{ name: "John Doe", isAttending: true }],
    email: "john@example.com",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const SuccessNotAttending: Story = {
  args: {
    step: "success",
    invitation: singleGuestInvitation,
    selectedGuests: [{ name: "John Doe", isAttending: false }],
    email: "john@example.com",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

export const ErrorStep: Story = {
  args: {
    step: "error",
    invitation: null,
    selectedGuests: [],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: "Guest not found on invitation list",
  },
};

export const LoadingState: Story = {
  args: {
    step: "name-input",
    invitation: null,
    selectedGuests: [],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: true,
    errorMessage: null,
  },
};

export const LegacyVariant: Story = {
  args: {
    variant: "legacy",
    step: "name-input",
    invitation: null,
    selectedGuests: [],
    email: "",
    nameFormat: "FULL_NAME",
    isLoading: false,
    errorMessage: null,
  },
};

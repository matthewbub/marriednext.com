import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CollaboratorInvitationCard } from "@/components/permissions/CollaboratorInvitationCard";
import { fn } from "storybook/test";

const meta = {
  title: "Permissions/CollaboratorInvitationCard",
  component: CollaboratorInvitationCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <ul>
          <Story />
        </ul>
      </div>
    ),
  ],
  args: {
    currentUserRole: "spouse",
    onRemove: fn(),
    onResend: fn(),
    onCopyInviteUrl: fn(),
    onChangeRole: fn(),
  },
} satisfies Meta<typeof CollaboratorInvitationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PendingInvitation: Story = {
  args: {
    invitation: {
      id: "1",
      email: "partner@example.com",
      role: "spouse",
      status: "pending",
      sentAt: "2024-10-25T16:20:00Z",
    },
  },
};

export const AcceptedInvitation: Story = {
  args: {
    invitation: {
      id: "2",
      email: "mom@example.com",
      role: "family",
      status: "accepted",
      sentAt: "2024-10-18T09:15:00Z",
      acceptedAt: "2024-10-18T11:45:00Z",
    },
  },
};

export const DeclinedInvitation: Story = {
  args: {
    invitation: {
      id: "3",
      email: "sibling@example.com",
      role: "family",
      status: "declined",
      sentAt: "2024-10-20T13:00:00Z",
      declinedAt: "2024-10-21T08:15:00Z",
    },
  },
};

export const PlannerPending: Story = {
  args: {
    invitation: {
      id: "4",
      email: "planner@weddings.com",
      role: "planner",
      status: "pending",
      sentAt: "2024-10-25T16:20:00Z",
    },
  },
};

export const WithoutMessage: Story = {
  args: {
    invitation: {
      id: "5",
      email: "aunt@example.com",
      role: "family",
      status: "accepted",
      sentAt: "2024-10-15T10:00:00Z",
      acceptedAt: "2024-10-15T14:30:00Z",
    },
  },
};

export const AsNonSpouse: Story = {
  args: {
    currentUserRole: "family",
    invitation: {
      id: "6",
      email: "partner@example.com",
      role: "spouse",
      status: "accepted",
      sentAt: "2024-10-15T10:00:00Z",
      acceptedAt: "2024-10-15T14:30:00Z",
    },
  },
};

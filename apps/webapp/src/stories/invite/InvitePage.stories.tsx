import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InviteAcceptance } from "@/components/invite/InviteAcceptance";
import { fn } from "storybook/test";

const meta = {
  title: "Invite/InviteAcceptance",
  component: InviteAcceptance,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onAccept: fn(),
    onReject: fn(),
  },
} satisfies Meta<typeof InviteAcceptance>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FamilyMember: Story = {
  args: {
    inviteId: "abc123",
    senderEmail: "bride@example.com",
    role: "family",
    invitedEmail: "Sarah & John",
    message: "Would love for you to help us plan our special day!",
  },
};

export const Spouse: Story = {
  args: {
    inviteId: "xyz789",
    senderEmail: "groom@example.com",
    role: "spouse",
    invitedEmail: "Emily & Michael",
    message: "Looking forward to planning this together!",
  },
};

export const WeddingPlanner: Story = {
  args: {
    inviteId: "planner456",
    senderEmail: "bride@example.com",
    role: "planner",
    invitedEmail: "Jessica & David",
  },
};

export const WithoutMessage: Story = {
  args: {
    inviteId: "nomsg789",
    senderEmail: "couple@example.com",
    role: "family",
    invitedEmail: "Alex & Jordan",
  },
};

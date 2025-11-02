import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CurrentUserCard } from "@/components/permissions/CurrentUserCard";
import { fn } from "storybook/test";

const meta = {
  title: "Permissions/CurrentUserCard",
  component: CurrentUserCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    role: {
      control: "select",
      options: ["spouse", "family", "planner"],
    },
  },
  args: {
    onRoleChange: fn(),
  },
} satisfies Meta<typeof CurrentUserCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spouse: Story = {
  args: {
    email: "you@example.com",
    role: "spouse",
  },
};

export const FamilyMember: Story = {
  args: {
    email: "you@example.com",
    role: "family",
  },
};

export const WeddingPlanner: Story = {
  args: {
    email: "you@example.com",
    role: "planner",
  },
};

export const LongEmail: Story = {
  args: {
    email: "verylongemailaddress@example.com",
    role: "spouse",
  },
};


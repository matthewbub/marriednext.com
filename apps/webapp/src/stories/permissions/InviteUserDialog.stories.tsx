import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InviteUserDialog } from "@/components/permissions/InviteUserDialog";
import { fn } from "storybook/test";

const meta = {
  title: "Permissions/InviteUserDialog",
  component: InviteUserDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn(),
    onOpenChange: fn(),
  },
} satisfies Meta<typeof InviteUserDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    open: true,
    isSubmitting: true,
  },
};

export const Closed: Story = {
  args: {
    open: false,
    isSubmitting: false,
  },
};


import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InviteUserForm } from "@/components/permissions/InviteUserForm";
import { fn } from "storybook/test";

const meta = {
  title: "Permissions/InviteUserForm",
  component: InviteUserForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn(),
  },
} satisfies Meta<typeof InviteUserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isSubmitting: false,
  },
};

export const Submitting: Story = {
  args: {
    isSubmitting: true,
  },
};


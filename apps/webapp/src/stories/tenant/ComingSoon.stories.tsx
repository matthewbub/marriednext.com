import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ComingSoon from "@/components/tenant/ComingSoon";

const meta = {
  title: "Tenant/ComingSoon",
  component: ComingSoon,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl mx-auto p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComingSoon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default coming soon message with default text and back link.",
      },
    },
  },
};

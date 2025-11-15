import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Footer from "@/components/tenant/Footer";

const meta = {
  title: "Tenant/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="w-full min-h-screen flex flex-col">
        <div className="flex-grow" />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default footer with credits and external link.",
      },
    },
  },
};

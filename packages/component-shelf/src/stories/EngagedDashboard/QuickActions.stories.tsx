import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QuickActions } from "./QuickActions";

const meta = {
  title: "EngagedDashboard/QuickActions",
  component: QuickActions,
  tags: ["autodocs"],
} satisfies Meta<typeof QuickActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    contributorCount: 3,
  },
};

import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RsvpStats } from "./RsvpStats";

const meta = {
  title: "EngagedDashboard/RsvpStats",
  component: RsvpStats,
  tags: ["autodocs"],
} satisfies Meta<typeof RsvpStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    totalHeadcount: 45,
    confirmedRsvps: 38,
    pendingRsvps: 7,
  },
};

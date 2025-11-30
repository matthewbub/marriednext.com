import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RsvpList } from "./RsvpList";

const meta = {
  title: "EngagedDashboard/RsvpList",
  component: RsvpList,
  tags: ["autodocs"],
} satisfies Meta<typeof RsvpList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

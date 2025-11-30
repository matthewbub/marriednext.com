import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountdownSection } from "./CountdownSection";

const meta = {
  title: "EngagedDashboard/CountdownSection",
  component: CountdownSection,
  tags: ["autodocs"],
} satisfies Meta<typeof CountdownSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    weddingDate: new Date("2025-06-15T18:00:00"),
    coupleName: "Sarah & Michael",
  },
};

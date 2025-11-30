import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountdownSection } from "../../components/theme/lisastheme/CountdownSection";

const meta = {
  title: "LisasTheme/CountdownSection",
  component: CountdownSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CountdownSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    eventDate: "2026-07-26 07:00:00",
  },
};

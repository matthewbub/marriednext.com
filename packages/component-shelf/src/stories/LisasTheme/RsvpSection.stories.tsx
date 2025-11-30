import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RsvpSection } from "../../components/theme/lisastheme/RsvpSection";

const meta = {
  title: "LisasTheme/RsvpSection",
  component: RsvpSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RsvpSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};

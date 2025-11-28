import "style-shelf/tailwind-hybrid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StickyNav } from "../../components/theme/lisastheme/StickyNav";

const meta = {
  title: "LisasTheme/StickyNav",
  component: StickyNav,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StickyNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};


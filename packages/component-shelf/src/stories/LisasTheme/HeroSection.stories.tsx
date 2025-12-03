import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HeroSection } from "../../components/theme/lisastheme/HeroSection";

const meta = {
  title: "LisasTheme/HeroSection",
  component: HeroSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: {
      nameA: "Yulissa",
      nameB: "Matthew",
      eventDate: "2026-07-26 07:00:00",
      location: "Bel Vino Winery",
    },
  },
};

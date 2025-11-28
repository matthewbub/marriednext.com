import "style-shelf/tailwind-hybrid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FooterSection } from "../../components/theme/lisastheme/FooterSection";

const meta = {
  title: "LisasTheme/FooterSection",
  component: FooterSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FooterSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    nameA: "Yulissa",
    nameB: "Matthew",
    eventDate: "2026-07-26 07:00:00",
    location: "Bel Vino Winery",
  },
};

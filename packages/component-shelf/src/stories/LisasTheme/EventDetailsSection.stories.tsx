import "style-shelf/tailwind-hybrid";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EventDetailsSection } from "../../components/theme/lisastheme/EventDetailsSection";

const meta = {
  title: "LisasTheme/EventDetailsSection",
  component: EventDetailsSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EventDetailsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    locationName: "Bel Vino Winery",
    locationAddress: "33515 Rancho California Rd, Temecula, CA 92591",
    eventDate: "2026-07-26 07:00:00",
    eventTime: "5:00 PM",
    mapsShareUrl: "https://maps.app.goo.gl/LzKDwyJxmDePAbvb6",
  },
};

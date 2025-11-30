import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MediaGallery } from "./MediaGallery";

const meta = {
  title: "EngagedDashboard/MediaGallery",
  component: MediaGallery,
  tags: ["autodocs"],
} satisfies Meta<typeof MediaGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

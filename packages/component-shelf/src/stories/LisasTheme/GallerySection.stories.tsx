import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { GallerySection } from "../../components/theme/lisastheme/GallerySection";

const meta = {
  title: "LisasTheme/GallerySection",
  component: GallerySection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GallerySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: {
      images: [],
    },
  },
};

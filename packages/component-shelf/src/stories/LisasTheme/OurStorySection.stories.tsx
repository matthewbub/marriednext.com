import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { OurStorySection } from "../../components/theme/lisastheme/OurStorySection";

const meta = {
  title: "LisasTheme/OurStorySection",
  component: OurStorySection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OurStorySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    data: {
      nameA: "Yulissa",
      nameB: "Matthew",
      imageUrl:
        "https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/lisastheme/main-image",
    },
  },
};

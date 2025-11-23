import type { Meta, StoryObj } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { MarriedNextMarketingUploadMemories } from "./MarriedNextMarketingUploadMemories";
import { marriedNextMarketingUploadMemoriesDefaults } from "./MarriedNextMarketingUploadMemories.constants";

const meta = {
  title: "MarriedNext.com Marketing/Upload Memories",
  component: MarriedNextMarketingUploadMemories,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarriedNextMarketingUploadMemories>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    ...marriedNextMarketingUploadMemoriesDefaults,
  },
};

import type { Meta, StoryObj } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { MarriedNextMarketingFooter } from "./MarriedNextMarketingFooter";
import { marriedNextMarketingFooterDefaults } from "./MarriedNextMarketingFooter.constants";

const meta = {
  title: "MarriedNext.com Marketing/Footer",
  component: MarriedNextMarketingFooter,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarriedNextMarketingFooter>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    ...marriedNextMarketingFooterDefaults,
  },
};

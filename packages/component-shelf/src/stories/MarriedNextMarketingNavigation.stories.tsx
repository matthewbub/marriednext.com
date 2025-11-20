import type { Meta, StoryObj } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { MarriedNextMarketingNavigation } from "./MarriedNextMarketingNavigation";
import { marriedNextMarketingNavigationDefaults } from "./MarriedNextMarketingNavigation.constants";

const meta = {
  title: "MarriedNext.com Marketing/Navigation",
  component: MarriedNextMarketingNavigation,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarriedNextMarketingNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    ...marriedNextMarketingNavigationDefaults,
  },
};

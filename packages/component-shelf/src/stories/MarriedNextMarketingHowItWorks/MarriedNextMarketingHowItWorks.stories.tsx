import type { Meta, StoryObj } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { MarriedNextMarketingHowItWorks } from "./MarriedNextMarketingHowItWorks";
import { howItWorksDefaults } from "./MarriedNextMarketingHowItWorks.constants";

const meta = {
  title: "MarriedNext.com Marketing/How It Works",
  component: MarriedNextMarketingHowItWorks,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarriedNextMarketingHowItWorks>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    ...howItWorksDefaults,
  },
};

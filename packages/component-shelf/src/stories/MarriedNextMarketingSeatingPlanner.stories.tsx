import type { Meta, StoryObj } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { MarriedNextMarketingSeatingPlanner } from "./MarriedNextMarketingSeatingPlanner";
import { marriedNextMarketingSeatingPlannerDefaults } from "./MarriedNextMarketingSeatingPlanner.constants";

const meta = {
  title: "MarriedNext.com Marketing/Seating Planner",
  component: MarriedNextMarketingSeatingPlanner,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
      defaultViewport: "responsive",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarriedNextMarketingSeatingPlanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    ...marriedNextMarketingSeatingPlannerDefaults,
  },
};

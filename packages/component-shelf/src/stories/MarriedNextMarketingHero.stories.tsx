import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarriedNextMarketingHero } from "./MarriedNextMarketingHero";
import { marriedNextMarketingHeroDefaults } from "./MarriedNextMarketingHero.constants";

const meta = {
  title: "MarriedNext.com Marketing/Hero",
  component: MarriedNextMarketingHero,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MarriedNextMarketingHero>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    ...marriedNextMarketingHeroDefaults,
  },
};

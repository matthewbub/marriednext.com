import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DomainStatus } from "./DomainStatus";

const meta = {
  title: "EngagedDashboard/DomainStatus",
  component: DomainStatus,
  tags: ["autodocs"],
} satisfies Meta<typeof DomainStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    subdomain: "sarah-michael",
    customDomain: "sarahandmichael.com",
    isPremium: false,
  },
};

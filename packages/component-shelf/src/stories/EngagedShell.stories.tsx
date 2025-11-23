import type { Meta, StoryObj } from "@storybook/react-vite";
import EngagedShell from "./EngagedShell";

const meta = {
  title: "Engaged/Shell",
  component: EngagedShell,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof EngagedShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

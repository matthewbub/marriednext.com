import type { Meta, StoryObj } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import { TableWithTrigonometry } from "./TableWithTrigonometry";
import { tableWithTrigonometryDefaults } from "./TableWithTrigonometry.constants";

const meta = {
  title: "Public/TableWithTrigonometry",
  component: TableWithTrigonometry,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TableWithTrigonometry>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    ...tableWithTrigonometryDefaults,
  },
};

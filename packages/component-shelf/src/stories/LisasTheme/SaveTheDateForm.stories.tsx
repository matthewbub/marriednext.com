import "style-shelf/tailwind";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SaveTheDateForm } from "../../components/theme/lisastheme/SaveTheDateForm";

const meta = {
  title: "LisasTheme/SaveTheDateForm",
  component: SaveTheDateForm,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SaveTheDateForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

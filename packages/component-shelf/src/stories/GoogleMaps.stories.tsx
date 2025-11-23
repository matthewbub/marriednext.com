import type { Meta, StoryObj } from "@storybook/react-vite";
import { GoogleMaps } from "./GoogleMaps";

const meta = {
  title: "Components/GoogleMaps",
  component: GoogleMaps,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GoogleMaps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.98513!3d40.75889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890",
  },
};

export const CustomSize: Story = {
  args: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841!2d-73.98513!3d40.75889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1234567890",
    width: 600,
    height: 450,
  },
};

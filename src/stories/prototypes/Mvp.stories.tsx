import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ScrollHighlightText } from "@/components/tenant/SlidingHighlightText";

export function Mvp() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <ScrollHighlightText text="We're getting married! We can't wait to have you there to share in the joy. Everything you need is right here: timing, venue details, what to wear, where to stay, plus a simple way to let us know you're coming. See you this summer!" />
    </div>
  );
}

const meta = {
  title: "Prototypes/Mvp",
  component: Mvp,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Mvp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "We're getting married! We can't wait to have you there to share in the joy. Everything you need is right here: timing, venue details, what to wear, where to stay, plus a simple way to let us know you're coming. See you this summer!",
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Countdown from "@/components/tenant/Countdown";

const defaultLabels = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

const meta = {
  title: "Tenant/Countdown",
  component: Countdown,
  parameters: {
    layout: "centered",
  },
  args: {
    labels: defaultLabels,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-4xl mx-auto p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Countdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FutureDate: Story = {
  args: {
    targetUtcIso: "2026-04-24T00:00:00Z",
    labels: defaultLabels,
  },
  parameters: {
    docs: {
      description: {
        story: "Countdown to a future date (April 24, 2026).",
      },
    },
  },
};

export const NearFuture: Story = {
  args: {
    targetUtcIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    labels: defaultLabels,
  },
  parameters: {
    docs: {
      description: {
        story: "Countdown to a date 7 days in the future.",
      },
    },
  },
};

export const VeryNear: Story = {
  args: {
    targetUtcIso: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    labels: defaultLabels,
  },
  parameters: {
    docs: {
      description: {
        story: "Countdown to a date 2 hours in the future.",
      },
    },
  },
};

export const PastDate: Story = {
  args: {
    targetUtcIso: "2020-01-01T00:00:00Z",
    labels: defaultLabels,
  },
  parameters: {
    docs: {
      description: {
        story: "Countdown with a past date (should show all zeros).",
      },
    },
  },
};

export const CustomLabels: Story = {
  args: {
    targetUtcIso: "2026-04-24T00:00:00Z",
    labels: {
      days: "Días",
      hours: "Horas",
      minutes: "Minutos",
      seconds: "Segundos",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Countdown with custom Spanish labels.",
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    targetUtcIso: "2026-04-24T00:00:00Z",
    labels: defaultLabels,
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Countdown on mobile viewport with responsive sizing.",
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    targetUtcIso: "2026-04-24T00:00:00Z",
    labels: defaultLabels,
  },
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story: "Countdown on tablet viewport.",
      },
    },
  },
};

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Header from "@/components/tenant/Header";
import { WeddingData } from "@/lib/tenant/weddingData.types";

const mockWeddingData: WeddingData = {
  id: "1",
  subdomain: "example",
  customDomain: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  fieldDisplayName: "Our Wedding",
  fieldLocationName: "The Grand Ballroom",
  fieldLocationAddress: "123 Main St, Anytown, USA",
  fieldEventDate: "2025-06-15T00:00:00Z",
  fieldEventTime: "4:00 PM",
  fieldMapsEmbedUrl: null,
  fieldMapsShareUrl: null,
  fieldQuestionsAndAnswers: null,
  fieldOurStory: null,
  fieldNameA: "Alex",
  fieldNameB: "Jordan",
  controlRsvpNameFormat: "FULL_NAME",
};

const meta = {
  title: "Tenant/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full min-h-screen bg-white">
        <Story />
      </div>
    ),
  ],
  args: {
    weddingData: mockWeddingData,
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomePage: Story = {
  parameters: {
    docs: {
      description: {
        story: "Header displayed on the home page with home nav item active.",
      },
    },
  },
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story:
          "Header on mobile view with responsive layout and mobile navigation.",
      },
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
    docs: {
      description: {
        story:
          "Header on tablet view showing transition between mobile and desktop layouts.",
      },
    },
  },
};

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
    docs: {
      description: {
        story: "Header on desktop view with full horizontal navigation.",
      },
    },
  },
};

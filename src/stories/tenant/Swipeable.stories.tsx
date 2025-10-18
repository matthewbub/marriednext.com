import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Swipeable from "@/components/tenant/Swipeable";

const meta = {
  title: "Tenant/Swipeable",
  component: Swipeable,
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
      <div className="w-full min-h-screen bg-gray-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Swipeable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithContent: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Swipeable Content</h1>
        <p className="text-lg mb-4">
          Swipe left or right to navigate between pages.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">Instructions</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>On mobile/touch devices: Swipe left to go to next page</li>
            <li>On mobile/touch devices: Swipe right to go to previous page</li>
            <li>
              Pages loop around (last page → first page, first page → last page)
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Swipeable wrapper with sample content. Test swipe gestures on touch devices.",
      },
    },
  },
};

export const HomePage: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Home Page</h1>
        <p className="text-lg mt-4">Swipe left to go to Our Story →</p>
      </div>
    ),
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    docs: {
      description: {
        story: "Swipeable on home page. Swipe left goes to /our-story.",
      },
    },
  },
};

export const MiddlePage: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Photos Page</h1>
        <p className="text-lg mt-4">
          ← Swipe right to go to Our Story | Swipe left to go to Wedding Party →
        </p>
      </div>
    ),
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/photos",
      },
    },
    docs: {
      description: {
        story:
          "Swipeable on middle page. Swipe left/right navigates to adjacent pages.",
      },
    },
  },
};

export const LastPage: Story = {
  args: {
    children: (
      <div className="p-8">
        <h1 className="text-4xl font-bold">Registry Page</h1>
        <p className="text-lg mt-4">
          ← Swipe right to go to Travel | Swipe left to loop back to Home →
        </p>
      </div>
    ),
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/registry",
      },
    },
    docs: {
      description: {
        story: "Swipeable on last page. Swipe left loops back to home page.",
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    children: (
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Mobile Swipe Test</h1>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-base">
            Touch and drag horizontally to navigate between pages.
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
    docs: {
      description: {
        story: "Swipeable component optimized for mobile touch interactions.",
      },
    },
  },
};

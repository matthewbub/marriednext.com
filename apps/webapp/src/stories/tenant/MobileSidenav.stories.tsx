import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import MobileSidenav from "@/components/tenant/MobileSidenav";

const mockNavLinks = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "Our Story" },
  { href: "/photos", label: "Photos" },
  { href: "/wedding-party", label: "Wedding Party" },
  { href: "/q-and-a", label: "Q + A" },
  { href: "/travel", label: "Travel" },
  { href: "/registry", label: "Registry" },
];

const mockGetNavItemClass = (href: string) =>
  `border-b-2 ${
    href === "/" ? "border-current" : "border-transparent hover:border-current"
  } transition`;

const meta = {
  title: "Tenant/MobileSidenav",
  component: MobileSidenav,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    navLinks: mockNavLinks,
    getNavItemClass: mockGetNavItemClass,
    ariaLabel: "Toggle navigation",
  },
} satisfies Meta<typeof MobileSidenav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mobile navigation in its default closed state with hamburger menu button.",
      },
    },
  },
};

export const Open: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Mobile navigation opened, showing overlay with navigation links.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector(
      'button[aria-label="Toggle navigation"]'
    );
    if (button instanceof HTMLElement) {
      button.click();
    }
  },
};

export const WithActiveRoute: Story = {
  args: {
    navLinks: mockNavLinks,
    getNavItemClass: (href) =>
      `border-b-2 ${
        href === "/our-story"
          ? "border-current"
          : "border-transparent hover:border-current"
      } transition`,
    ariaLabel: "Toggle navigation",
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/our-story",
      },
    },
    docs: {
      description: {
        story: "Mobile navigation with an active route highlighted.",
      },
    },
  },
};

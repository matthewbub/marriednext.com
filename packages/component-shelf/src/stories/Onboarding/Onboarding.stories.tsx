import type { Meta, StoryObj } from "@storybook/react-vite";
import OnboardingPage from "../../components/application/onboarding";

const meta = {
  title: "Application/Onboarding",
  component: OnboardingPage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof OnboardingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const MockLink = ({
  href,
  children,
  className,
}: {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <a href={href} className={className}>
    {children}
  </a>
);

export const Default: Story = {
  args: {
    link: MockLink,
    onSubmit: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSkip: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSubdomainBlur: async (subdomain: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (subdomain === "taken") {
        return { available: false, error: "This subdomain is already taken" };
      }
      return { available: true };
    },
  },
};

export const WithTakenSubdomain: Story = {
  args: {
    link: MockLink,
    onSubmit: async () => {},
    onSkip: async () => {},
    onSubdomainBlur: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { available: false, error: "This subdomain is already taken" };
    },
  },
};

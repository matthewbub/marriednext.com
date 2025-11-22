import type { Meta, StoryObj } from "@storybook/react-vite";
import { TenantHomePage } from "./TenantHomePage";

const meta = {
  title: "Pages/TenantHomePage",
  component: TenantHomePage,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TenantHomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const MockRsvpForm = () => (
  <div className="p-8 border border-gray-300 rounded-lg bg-white max-w-md">
    <h2 className="text-2xl font-semibold mb-4">RSVP</h2>
    <p className="text-gray-600">Mock RSVP form component</p>
  </div>
);

export const Default: Story = {
  args: {
    fieldNameA: "Sarah",
    fieldNameB: "Michael",
    fieldLocationName: "The Grand Estate",
    fieldLocationAddress: "123 Wedding Lane\nSan Francisco, CA 94102",
    fieldMapsShareUrl: "https://maps.google.com",
    rsvpFormComponent: <MockRsvpForm />,
  },
};

export const WithoutLocation: Story = {
  args: {
    fieldNameA: "Emily",
    fieldNameB: "James",
    rsvpFormComponent: <MockRsvpForm />,
  },
};

export const CustomImage: Story = {
  args: {
    fieldNameA: "Alexandra",
    fieldNameB: "David",
    imageUrl: "https://via.placeholder.com/420x500",
    imageWidth: 420,
    imageHeight: 500,
    fieldLocationName: "Beachside Resort",
    fieldLocationAddress: "456 Ocean Drive\nMalibu, CA 90265",
    fieldMapsShareUrl: "https://maps.google.com",
    rsvpFormComponent: <MockRsvpForm />,
  },
};

export const WithCustomImageComponent: Story = {
  args: {
    fieldNameA: "Olivia",
    fieldNameB: "Ethan",
    fieldLocationName: "Mountain Lodge",
    fieldLocationAddress: "789 Summit Road\nAspen, CO 81611",
    fieldMapsShareUrl: "https://maps.google.com",
    imageComponent: (
      <div className="relative">
        <img
          src="https://via.placeholder.com/420x500"
          alt="Custom styled couple"
          width={420}
          height={500}
          className="rounded-lg shadow-xl"
        />
      </div>
    ),
    rsvpFormComponent: <MockRsvpForm />,
  },
};

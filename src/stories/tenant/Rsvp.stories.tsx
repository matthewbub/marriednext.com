import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RsvpForm from "@/components/RsvpForm";
import { useRsvpStore } from "@/stores/rsvpStore";
import { useEffect } from "react";

const meta = {
  title: "Tenant/Rsvp",
  component: RsvpForm,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen w-full bg-gray-50">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RsvpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NameInput: Story = {
  render: () => {
    const StoryComponent = () => {
      useEffect(() => {
        useRsvpStore.getState().reset();
      }, []);
      return <RsvpForm onLookup={() => {}} onSubmit={() => {}} />;
    };
    return <StoryComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "Initial state where user enters their name to find their invitation.",
      },
    },
  },
};

export const GuestSelection: Story = {
  render: () => {
    const StoryComponent = () => {
      useEffect(() => {
        const store = useRsvpStore.getState();
        store.reset();
        store.setInvitation(
          {
            id: "inv-123",
            weddingId: "wedding-123",
            inviteGroupName: "Smith Family",
            email: null,
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            guests: [
              {
                id: "guest-1",
                weddingId: "wedding-123",
                invitationId: "inv-123",
                nameOnInvitation: "John Smith",
                isAttending: null,
                hasPlusOne: null,
                dateEntrySubmitted: null,
              },
              {
                id: "guest-2",
                weddingId: "wedding-123",
                invitationId: "inv-123",
                nameOnInvitation: "Jane Smith",
                isAttending: null,
                hasPlusOne: null,
                dateEntrySubmitted: null,
              },
            ],
          },
          "FULL_NAME"
        );
        store.setStep("guest-selection");
      }, []);
      return <RsvpForm onLookup={() => {}} onSubmit={() => {}} />;
    };
    return <StoryComponent />;
  },
  parameters: {
    docs: {
      description: {
        story:
          "State after name is validated, showing guest selection checkboxes.",
      },
    },
  },
};

export const EmailCollection: Story = {
  render: () => {
    const StoryComponent = () => {
      useEffect(() => {
        const store = useRsvpStore.getState();
        store.reset();
        store.setInvitation(
          {
            id: "inv-123",
            weddingId: "wedding-123",
            inviteGroupName: "John Smith",
            email: null,
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            guests: [
              {
                id: "guest-1",
                weddingId: "wedding-123",
                invitationId: "inv-123",
                nameOnInvitation: "John Smith",
                isAttending: true,
                hasPlusOne: null,
                dateEntrySubmitted: null,
              },
            ],
          },
          "FULL_NAME"
        );
        store.setStep("email-collection");
      }, []);
      return <RsvpForm onLookup={() => {}} onSubmit={() => {}} />;
    };
    return <StoryComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: "State where the user is asked to provide their email address.",
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => {
    const StoryComponent = () => {
      useEffect(() => {
        const store = useRsvpStore.getState();
        store.reset();
        store.setLoading(true);
      }, []);
      return <RsvpForm onLookup={() => {}} onSubmit={() => {}} />;
    };
    return <StoryComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: "Component in loading state while submitting or validating.",
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => {
    const StoryComponent = () => {
      useEffect(() => {
        const store = useRsvpStore.getState();
        store.reset();
        store.setError(
          "We couldn't find your invitation. Please check your name and try again."
        );
      }, []);
      return <RsvpForm onLookup={() => {}} onSubmit={() => {}} />;
    };
    return <StoryComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: "Error state when something goes wrong during the RSVP process.",
      },
    },
  },
};

export const SuccessState: Story = {
  render: () => {
    const StoryComponent = () => {
      useEffect(() => {
        const store = useRsvpStore.getState();
        store.reset();
        store.setInvitation(
          {
            id: "inv-123",
            weddingId: "wedding-123",
            inviteGroupName: "John Smith",
            email: "john@example.com",
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            guests: [
              {
                id: "guest-1",
                weddingId: "wedding-123",
                invitationId: "inv-123",
                nameOnInvitation: "John Smith",
                isAttending: true,
                hasPlusOne: null,
                dateEntrySubmitted: new Date().toISOString(),
              },
            ],
          },
          "FULL_NAME"
        );
        store.setStep("success");
      }, []);
      return <RsvpForm onLookup={() => {}} onSubmit={() => {}} />;
    };
    return <StoryComponent />;
  },
  parameters: {
    docs: {
      description: {
        story: "Success state after RSVP is successfully submitted.",
      },
    },
  },
};

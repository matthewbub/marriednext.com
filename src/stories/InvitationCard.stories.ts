import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, within, userEvent, waitFor } from "storybook/test";
import InvitationCard from "@/components/guest-list/InvitationCard";
import { DbInvitationGroupWithGuests } from "@/database/drizzle";
import { EditFormData } from "@/components/guest-list/guestList.types";

const createMockEntry = (
  overrides?: Partial<DbInvitationGroupWithGuests>
): DbInvitationGroupWithGuests => ({
  id: "1",
  weddingId: null,
  guestA: "John Doe",
  guestB: null,
  guestC: null,
  guestD: null,
  guestE: null,
  guestF: null,
  guestG: null,
  guestH: null,
  createdAt: "2024-01-15T10:00:00.000Z",
  lastUpdatedAt: "2024-01-15T10:00:00.000Z",
  inviteGroupName: null,
  guest_guestA: {
    id: "1",
    weddingId: null,
    nameOnInvitation: "John Doe",
    isAttending: true,
    hasPlusOne: false,
    dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
  },
  guest_guestB: null,
  guest_guestC: null,
  guest_guestD: null,
  guest_guestE: null,
  guest_guestF: null,
  guest_guestG: null,
  guest_guestH: null,
  ...overrides,
});

const createEditForm = (entry: DbInvitationGroupWithGuests): EditFormData => ({
  guestA: entry.guestA,
  guestAAttending: entry.guest_guestA?.isAttending ?? null,
  guestAHasPlusOne: entry.guest_guestA?.hasPlusOne ?? false,
  guestB: entry.guestB,
  guestBAttending: entry.guest_guestB?.isAttending ?? null,
  guestBHasPlusOne: entry.guest_guestB?.hasPlusOne ?? false,
  guestC: entry.guestC,
  guestCAttending: entry.guest_guestC?.isAttending ?? null,
  guestCHasPlusOne: entry.guest_guestC?.hasPlusOne ?? false,
  guestD: entry.guestD,
  guestDAttending: entry.guest_guestD?.isAttending ?? null,
  guestDHasPlusOne: entry.guest_guestD?.hasPlusOne ?? false,
  guestE: entry.guestE,
  guestEAttending: entry.guest_guestE?.isAttending ?? null,
  guestEHasPlusOne: entry.guest_guestE?.hasPlusOne ?? false,
  guestF: entry.guestF,
  guestFAttending: entry.guest_guestF?.isAttending ?? null,
  guestFHasPlusOne: entry.guest_guestF?.hasPlusOne ?? false,
  guestG: entry.guestG,
  guestGAttending: entry.guest_guestG?.isAttending ?? null,
  guestGHasPlusOne: entry.guest_guestG?.hasPlusOne ?? false,
  guestH: entry.guestH,
  guestHAttending: entry.guest_guestH?.isAttending ?? null,
  guestHHasPlusOne: entry.guest_guestH?.hasPlusOne ?? false,
  inviteGroupName: entry.inviteGroupName,
});

const meta = {
  title: "GuestList/InvitationCard",
  component: InvitationCard,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof InvitationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleGuest: Story = {
  args: {
    entry: createMockEntry(),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const TwoGuests: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const LargeGroup: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guestC: "Bob Johnson",
      guestD: "Alice Williams",
      guestE: "Charlie Brown",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestC: {
        id: "3",
        weddingId: null,
        nameOnInvitation: "Bob Johnson",
        isAttending: null,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestD: {
        id: "4",
        weddingId: null,
        nameOnInvitation: "Alice Williams",
        isAttending: false,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestE: {
        id: "5",
        weddingId: null,
        nameOnInvitation: "Charlie Brown",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const WithGroupName: Story = {
  args: {
    entry: createMockEntry({
      inviteGroupName: "The Smith Family",
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const EditMode: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: true,
    editForm: createEditForm(
      createMockEntry({
        guestB: "Jane Smith",
        guest_guestB: {
          id: "2",
          weddingId: null,
          nameOnInvitation: "Jane Smith",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
      })
    ),
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const EditModeWithGroupName: Story = {
  args: {
    entry: createMockEntry({
      inviteGroupName: "The Smith Family",
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: true,
    editForm: createEditForm(
      createMockEntry({
        inviteGroupName: "The Smith Family",
        guestB: "Jane Smith",
        guest_guestB: {
          id: "2",
          weddingId: null,
          nameOnInvitation: "Jane Smith",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
      })
    ),
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const SavingState: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: true,
    editForm: createEditForm(
      createMockEntry({
        guestB: "Jane Smith",
        guest_guestB: {
          id: "2",
          weddingId: null,
          nameOnInvitation: "Jane Smith",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
      })
    ),
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: true,
    root: "div",
  },
};

export const WithCollapseButton: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    onCollapse: fn(),
    root: "div",
  },
};

export const InteractiveEditFlow: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },

  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Open menu and click Edit", async () => {
      const menuButton = canvas.getByRole("button", {
        name: "Open guest menu",
      });
      await userEvent.click(menuButton);

      await waitFor(() => {
        const portalContent = within(document.body).queryByRole("menu");
        if (!portalContent) throw new Error("Menu not found");
      });

      await userEvent.keyboard("{Escape}");
      await waitFor(() => {
        const portalContent = within(document.body).queryByRole("menu");
        if (portalContent) throw new Error("Menu still open");
      });
    });
  },
};

export const MixedAttendanceStatus: Story = {
  args: {
    entry: createMockEntry({
      guestB: "Jane Smith",
      guestC: "Bob Johnson",
      guestD: "Alice Williams",
      guest_guestB: {
        id: "2",
        weddingId: null,
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestC: {
        id: "3",
        weddingId: null,
        nameOnInvitation: "Bob Johnson",
        isAttending: false,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestD: {
        id: "4",
        weddingId: null,
        nameOnInvitation: "Alice Williams",
        isAttending: null,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

export const SingleGuestWithPlusOne: Story = {
  args: {
    entry: createMockEntry({
      guest_guestA: {
        id: "1",
        weddingId: null,
        nameOnInvitation: "John Doe",
        isAttending: true,
        hasPlusOne: true,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
    }),
    isEditing: false,
    editForm: null,
    onEdit: fn(),
    onRemove: fn(),
    onSave: fn(),
    onCancel: fn(),
    onFormChange: fn(),
    isSaving: false,
    root: "div",
  },
};

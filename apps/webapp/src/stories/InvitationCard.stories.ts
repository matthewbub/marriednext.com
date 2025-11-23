import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, within, userEvent, waitFor } from "storybook/test";
import InvitationCard from "@/components/guest-list/InvitationCard";
import { DbInvitationGroupWithGuests, DbGuest } from "@/database/drizzle";
import { EditFormData } from "@/components/guest-list/guestList.types";

const createMockEntry = (
  overrides?: Partial<DbInvitationGroupWithGuests> & Record<string, unknown>
): DbInvitationGroupWithGuests => {
  const base: Partial<DbInvitationGroupWithGuests> & Record<string, unknown> = {
    id: "1",
    weddingId: null,
    createdAt: "2024-01-15T10:00:00.000Z",
    lastUpdatedAt: "2024-01-15T10:00:00.000Z",
    inviteGroupName: null,
    email: null,
  };

  // If explicit guests provided, use them
  if (overrides?.guests)
    return { ...(base as object), ...overrides } as DbInvitationGroupWithGuests;

  const guests: DbGuest[] = [];

  const addIf = (maybe: unknown) => {
    if (!maybe) return;
    if (typeof maybe === "string") {
      guests.push({
        id: `${guests.length + 1}`,
        weddingId: null,
        invitationId: base.id as string,
        nameOnInvitation: maybe,
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: base.createdAt as string,
      } as DbGuest);
      return;
    }

    if (typeof maybe === "object") {
      const m = maybe as Record<string, unknown>;
      guests.push({
        id: (m.id as string) ?? `${guests.length + 1}`,
        weddingId: (m.weddingId as string) ?? null,
        invitationId: (m.invitationId as string) ?? (base.id as string),
        nameOnInvitation: (m.nameOnInvitation as string) ?? String(m),
        isAttending: (m.isAttending as boolean) ?? null,
        hasPlusOne: (m.hasPlusOne as boolean) ?? false,
        dateEntrySubmitted:
          (m.dateEntrySubmitted as string) ?? (base.createdAt as string),
      } as DbGuest);
    }
  };

  for (const k of [
    "guest_guestA",
    "guest_guestB",
    "guest_guestC",
    "guest_guestD",
    "guest_guestE",
    "guest_guestF",
    "guest_guestG",
    "guest_guestH",
  ]) {
    addIf((overrides as Record<string, unknown>)?.[k]);
  }

  for (const letter of ["A", "B", "C", "D", "E", "F", "G", "H"]) {
    addIf((overrides as Record<string, unknown>)?.[`guest${letter}`]);
  }

  if (guests.length === 0) addIf("John Doe");

  return {
    ...(base as object),
    ...overrides,
    guests,
  } as DbInvitationGroupWithGuests;
};

const createEditForm = (entry: DbInvitationGroupWithGuests): EditFormData => {
  const guests = (entry.guests || []).map((g) => ({
    id: g.id,
    nameOnInvitation: g.nameOnInvitation,
    isAttending: g.isAttending ?? null,
    hasPlusOne: g.hasPlusOne ?? false,
  }));

  return {
    guests,
    inviteGroupName: entry.inviteGroupName ?? null,
  };
};

const meta = {
  title: "Engaged/InvitationCard",
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
        invitationId: "1",
        nameOnInvitation: "Jane Smith",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guests: [
        {
          id: "1",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "John Doe",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
        {
          id: "2",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "Jane Smith",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
      ],
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
        invitationId: "1",
        nameOnInvitation: "Bob Johnson",
        isAttending: null,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestD: {
        id: "4",
        weddingId: null,
        invitationId: "1",
        nameOnInvitation: "Alice Williams",
        isAttending: false,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guest_guestE: {
        id: "5",
        weddingId: null,
        invitationId: "1",
        nameOnInvitation: "Charlie Brown",
        isAttending: true,
        hasPlusOne: false,
        dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
      },
      guests: [
        {
          id: "1",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "John Doe",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
        {
          id: "2",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "Jane Smith",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
        {
          id: "3",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "Bob Johnson",
          isAttending: null,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
        {
          id: "4",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "Alice Williams",
          isAttending: false,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
        {
          id: "5",
          weddingId: null,
          invitationId: "1",
          nameOnInvitation: "Charlie Brown",
          isAttending: true,
          hasPlusOne: false,
          dateEntrySubmitted: "2024-01-15T10:00:00.000Z",
        },
      ],
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

import { DbInvitationGroupWithGuests } from "@/database/drizzle";

export interface UpdateGuestPayload {
  entryId: number;
  guestA: string;
  guestAAttending: boolean | null;
  guestAHasPlusOne: boolean;
  guestB: string | null;
  guestBAttending: boolean | null;
  guestBHasPlusOne: boolean;
  inviteGroupName: string | null;
}

export interface GuestListDisplayProps {
  guestListWithGroups: DbInvitationGroupWithGuests[];
  onUpdateGuest: (payload: UpdateGuestPayload) => void;
  onDeleteGuest: (entryId: number) => void;
  isUpdating: boolean;
  editingId: number | null;
  onEditingIdChange: (id: number | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: DbInvitationGroupWithGuests[] | null;
  searchResultsCount: number;
  isSearching: boolean;
}

export interface EditFormData {
  guestA: string;
  guestAAttending: boolean | null;
  guestAHasPlusOne: boolean;
  guestB: string | null;
  guestBAttending: boolean | null;
  guestBHasPlusOne: boolean;
  inviteGroupName: string | null;
}

export interface InvitationCardProps {
  entry: DbInvitationGroupWithGuests;
  isEditing: boolean;
  editForm: EditFormData | null;
  onEdit: () => void;
  onRemove: () => void;
  onSave: () => void;
  onCancel: () => void;
  onFormChange: (form: EditFormData) => void;
  isSaving: boolean;
}

export interface GuestFieldsEditProps {
  editForm: EditFormData;
  onFormChange: (form: EditFormData) => void;
  disabled?: boolean;
}

export interface GuestFieldsViewProps {
  entry: DbInvitationGroupWithGuests;
}

export type SortOption =
  | "alpha-asc"
  | "alpha-desc"
  | "date-newest"
  | "date-oldest"
  | "updated-newest";

export type GuestListData = {
  guestListWithGroups: DbInvitationGroupWithGuests[];
  guestListCount: number;
  guestListWithGroupsCount: number;
  plusOneCount: number;
};

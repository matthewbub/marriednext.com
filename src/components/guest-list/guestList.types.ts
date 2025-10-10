import { DbInvitationGroupWithGuests } from "@/database/drizzle";

export interface UpdateGuestPayload {
  entryId: number;
  guestA: string;
  guestAAttending: boolean | null;
  guestAHasPlusOne: boolean;
  guestB: string | null;
  guestBAttending: boolean | null;
  guestBHasPlusOne: boolean;
  guestC: string | null;
  guestCAttending: boolean | null;
  guestCHasPlusOne: boolean;
  guestD: string | null;
  guestDAttending: boolean | null;
  guestDHasPlusOne: boolean;
  guestE: string | null;
  guestEAttending: boolean | null;
  guestEHasPlusOne: boolean;
  guestF: string | null;
  guestFAttending: boolean | null;
  guestFHasPlusOne: boolean;
  guestG: string | null;
  guestGAttending: boolean | null;
  guestGHasPlusOne: boolean;
  guestH: string | null;
  guestHAttending: boolean | null;
  guestHHasPlusOne: boolean;
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
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  isSorting: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

export interface EditFormData {
  guestA: string;
  guestAAttending: boolean | null;
  guestAHasPlusOne: boolean;
  guestB: string | null;
  guestBAttending: boolean | null;
  guestBHasPlusOne: boolean;
  guestC: string | null;
  guestCAttending: boolean | null;
  guestCHasPlusOne: boolean;
  guestD: string | null;
  guestDAttending: boolean | null;
  guestDHasPlusOne: boolean;
  guestE: string | null;
  guestEAttending: boolean | null;
  guestEHasPlusOne: boolean;
  guestF: string | null;
  guestFAttending: boolean | null;
  guestFHasPlusOne: boolean;
  guestG: string | null;
  guestGAttending: boolean | null;
  guestGHasPlusOne: boolean;
  guestH: string | null;
  guestHAttending: boolean | null;
  guestHHasPlusOne: boolean;
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
  onCollapse?: () => void;
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
  hasMore: boolean;
  currentOffset: number;
  currentLimit: number;
};

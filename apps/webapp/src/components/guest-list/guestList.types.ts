import { DbInvitationGroupWithGuests, DbGuest } from "@/database/drizzle";

export interface GuestFormData {
  id?: string;
  nameOnInvitation: string;
  isAttending: boolean | null;
  hasPlusOne: boolean;
}

export interface UpdateGuestPayload {
  entryId: string;
  guests: GuestFormData[];
  inviteGroupName: string | null;
}

export interface GuestListDisplayProps {
  guestListWithGroups: DbInvitationGroupWithGuests[];
  onUpdateGuest: (payload: UpdateGuestPayload) => void;
  onDeleteGuest: (entryId: string) => void;
  isUpdating: boolean;
  editingId: string | null;
  onEditingIdChange: (id: string | null) => void;
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
  guests: GuestFormData[];
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
  root?: "div" | "li";
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

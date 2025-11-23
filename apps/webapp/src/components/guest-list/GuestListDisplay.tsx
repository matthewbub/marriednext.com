"use client";

import { useState, useEffect } from "react";
import { DbInvitationGroupWithGuests } from "@/database/drizzle";
import { LayoutGrid, List, Search } from "lucide-react";
import clsx from "clsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  GuestListDisplayProps,
  EditFormData,
  SortOption,
} from "@/components/guest-list/guestList.types";
import InvitationCard from "@/components/guest-list/InvitationCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

export default function GuestListDisplay({
  guestListWithGroups,
  onUpdateGuest,
  onDeleteGuest,
  isUpdating,
  editingId,
  onEditingIdChange,
  searchQuery,
  onSearchChange,
  searchResults,
  searchResultsCount,
  isSearching,
  sortBy,
  onSortChange,
  isSorting,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: GuestListDisplayProps) {
  const [viewMode, setViewMode] = useState<"expanded" | "condensed">(
    "expanded"
  );
  const [editForm, setEditForm] = useState<EditFormData | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setExpandedId(null);
  }, [viewMode]);

  const handleEdit = (entry: DbInvitationGroupWithGuests) => {
    onEditingIdChange(entry.id);
    setEditForm({
      guests: entry.guests.map((g) => ({
        id: g.id,
        nameOnInvitation: g.nameOnInvitation,
        isAttending: g.isAttending,
        hasPlusOne: g.hasPlusOne ?? false,
      })),
      inviteGroupName: entry.inviteGroupName ?? null,
    });
  };

  const handleCancelEdit = () => {
    onEditingIdChange(null);
    setEditForm(null);
  };

  const handleSubmitEdit = (entryId: string) => {
    if (!editForm) return;

    onUpdateGuest({
      entryId,
      ...editForm,
    });
  };

  const displayList =
    searchQuery && searchResults ? searchResults : guestListWithGroups ?? [];

  const getGuestNames = (entry: DbInvitationGroupWithGuests) => {
    return entry.guests.map((g) => g.nameOnInvitation);
  };

  const getDefaultDisplayName = (entry: DbInvitationGroupWithGuests) => {
    const guestNames = getGuestNames(entry);
    const guestCount = guestNames.length;
    if (guestCount === 0) return "Unnamed Group";
    if (guestCount === 1) return guestNames[0];
    if (guestCount === 2) return `${guestNames[0]} & ${guestNames[1]}`;
    return `${guestNames[0]} Group`;
  };

  const getDisplayName = (entry: DbInvitationGroupWithGuests) =>
    entry.inviteGroupName || getDefaultDisplayName(entry);

  return (
    <div>
      <div className="flex justify-between items-center gap-2 mb-4">
        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => {
            onSortChange(value);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alpha-asc">A → Z</SelectItem>
            <SelectItem value="alpha-desc">Z → A</SelectItem>
            <SelectItem value="date-newest">Newest First</SelectItem>
            <SelectItem value="date-oldest">Oldest First</SelectItem>
            <SelectItem value="updated-newest">Recently Updated</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode("expanded");
            }}
            className={clsx(
              "p-2 rounded-lg transition-colors border",
              viewMode === "expanded" &&
                "bg-white text-gray-900 border-gray-300 shadow-sm",
              viewMode !== "expanded" &&
                "bg-white/50 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300"
            )}
            aria-label="Expanded view"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setViewMode("condensed");
            }}
            className={clsx(
              "p-2 rounded-lg transition-colors border",
              viewMode === "condensed" &&
                "bg-white text-gray-900 border-gray-300 shadow-sm",
              viewMode !== "condensed" &&
                "bg-white/50 text-gray-700 border-gray-200 hover:bg-white hover:border-gray-300"
            )}
            aria-label="Condensed view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by guest name or group..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && !isSearching && (
          <p className="text-sm text-gray-600 mt-2">
            Found {searchResultsCount}{" "}
            {searchResultsCount === 1 ? "result" : "results"}
          </p>
        )}
      </div>

      {isSorting ? (
        <LoadingSpinner message="Sorting guests..." className="p-0" />
      ) : isSearching ? (
        <LoadingSpinner message="Searching guests..." className="p-0" />
      ) : searchQuery && searchResultsCount === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600">
            No guests match your search for &quot;{searchQuery}&quot;
          </p>
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <List className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No guests yet
          </h3>
          <p className="text-gray-600">
            Get started by adding your first guest to the list
          </p>
        </div>
      ) : (
        <>
          {viewMode === "expanded" ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayList.map((entry) => (
                <InvitationCard
                  key={entry.id}
                  entry={entry}
                  isEditing={editingId === entry.id}
                  editForm={editForm}
                  onEdit={() => handleEdit(entry)}
                  onRemove={() => onDeleteGuest(entry.id)}
                  onSave={() => handleSubmitEdit(entry.id)}
                  onCancel={handleCancelEdit}
                  onFormChange={setEditForm}
                  isSaving={isUpdating && editingId === entry.id}
                />
              ))}
            </ul>
          ) : (
            <ul className="space-y-3">
              {displayList.map((entry) => {
                const attending = entry.attending ?? 0;
                const total = entry.total ?? 0;
                const isExpanded = expandedId === entry.id;

                if (isExpanded) {
                  return (
                    <InvitationCard
                      key={entry.id}
                      entry={entry}
                      isEditing={editingId === entry.id}
                      editForm={editForm}
                      onEdit={() => handleEdit(entry)}
                      onRemove={() => onDeleteGuest(entry.id)}
                      onSave={() => handleSubmitEdit(entry.id)}
                      onCancel={handleCancelEdit}
                      onFormChange={setEditForm}
                      isSaving={isUpdating && editingId === entry.id}
                      onCollapse={() => setExpandedId(null)}
                    />
                  );
                }

                return (
                  <li
                    key={entry.id}
                    onClick={() => setExpandedId(entry.id)}
                    className="rounded-xl bg-white border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getDisplayName(entry)}
                      </h3>
                      <span
                        className={clsx(
                          "text-sm font-bold px-2 py-1 rounded",
                          attending === total && "text-green-800 bg-green-50",
                          attending > 0 &&
                            attending < total &&
                            "text-amber-800 bg-amber-50",
                          attending === 0 && "text-gray-700 bg-gray-100"
                        )}
                      >
                        ({attending}/{total})
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {!searchQuery && (
            <>
              {isLoadingMore ? (
                <LoadingSpinner message="Loading more guests..." size="small" />
              ) : hasMore ? (
                <div className="flex justify-center mt-6">
                  <Button onClick={onLoadMore} variant="outline" size="lg">
                    Load More
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  );
}

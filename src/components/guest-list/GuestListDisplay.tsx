"use client";

import { useState, useEffect } from "react";
import { DbInvitationGroupWithGuests } from "@/database/drizzle";
import { LayoutGrid, List, Search } from "lucide-react";
import { telemetry } from "@/lib/telemetry";
import { useTelemetry } from "@/hooks/useTelemetry";
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

export default function GuestListDisplay({
  guestListWithGroups,
  onUpdateGuest,
  isUpdating,
  editingId,
  onEditingIdChange,
  searchQuery,
  onSearchChange,
  searchResults,
  searchResultsCount,
  isSearching,
}: GuestListDisplayProps) {
  const [viewMode, setViewMode] = useState<"expanded" | "condensed">(
    "expanded"
  );
  const [sortBy, setSortBy] = useState<SortOption>("alpha-asc");
  const [editForm, setEditForm] = useState<EditFormData | null>(null);

  const { track } = useTelemetry();

  useEffect(() => {
    track(() => telemetry.trackGuestListComponentMount());
    track(() => telemetry.trackGuestListSortDefault(sortBy));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (entry: DbInvitationGroupWithGuests) => {
    onEditingIdChange(entry.id);
    setEditForm({
      guestA: entry.guestA,
      guestAAttending: entry.invitation_guestA?.isAttending ?? null,
      guestAHasPlusOne: entry.invitation_guestA?.hasPlusOne ?? false,
      guestB: entry.guestB ?? null,
      guestBAttending: entry.invitation_guestB?.isAttending ?? null,
      guestBHasPlusOne: entry.invitation_guestB?.hasPlusOne ?? false,
      inviteGroupName: entry.inviteGroupName ?? null,
    });
  };

  const handleCancelEdit = () => {
    onEditingIdChange(null);
    setEditForm(null);
  };

  const handleSubmitEdit = (entryId: number) => {
    if (!editForm) return;

    onUpdateGuest({
      entryId,
      ...editForm,
    });
  };

  const displayList =
    searchQuery && searchResults ? searchResults : guestListWithGroups;

  const sortedGuestList = [...displayList].sort((a, b) => {
    const getDisplayName = (entry: DbInvitationGroupWithGuests) =>
      entry.inviteGroupName ||
      (entry.guestB ? `${entry.guestA} & ${entry.guestB}` : entry.guestA);

    switch (sortBy) {
      case "alpha-asc":
        return getDisplayName(a).localeCompare(getDisplayName(b));
      case "alpha-desc":
        return getDisplayName(b).localeCompare(getDisplayName(a));
      case "date-newest":
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "date-oldest":
        if (!a.createdAt || !b.createdAt) return 0;
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "updated-newest":
        if (!a.lastUpdatedAt || !b.lastUpdatedAt) return 0;
        return (
          new Date(b.lastUpdatedAt).getTime() -
          new Date(a.lastUpdatedAt).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center gap-2 mb-4">
        <Select
          value={sortBy}
          onValueChange={(value: SortOption) => {
            setSortBy(value);
            track(() => telemetry.trackGuestListSortOption(value));
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
              track(() => telemetry.trackGuestListViewToggle("expanded"));
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
              track(() => telemetry.trackGuestListViewToggle("condensed"));
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
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            {isSearching ? (
              "Searching..."
            ) : (
              <>
                Found {searchResultsCount}{" "}
                {searchResultsCount === 1 ? "result" : "results"}
              </>
            )}
          </p>
        )}
      </div>

      {searchQuery && searchResultsCount === 0 && !isSearching ? (
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
      ) : (
        <ul className="space-y-3">
          {sortedGuestList.map((entry) => {
            const attending = entry.attending ?? 0;
            const total = entry.total ?? 0;

            if (viewMode === "condensed") {
              const displayName =
                entry.inviteGroupName ||
                (entry.guestB
                  ? `${entry.guestA} & ${entry.guestB}`
                  : entry.guestA);

              return (
                <li
                  key={entry.id}
                  className="rounded-xl bg-white border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {displayName}
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
            }

            return (
              <InvitationCard
                key={entry.id}
                entry={entry}
                isEditing={editingId === entry.id}
                editForm={editForm}
                onEdit={() => handleEdit(entry)}
                onRemove={() => console.log("Remove", entry.id)}
                onSave={() => handleSubmitEdit(entry.id)}
                onCancel={handleCancelEdit}
                onFormChange={setEditForm}
                isSaving={isUpdating && editingId === entry.id}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

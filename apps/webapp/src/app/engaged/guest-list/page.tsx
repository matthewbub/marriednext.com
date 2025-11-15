"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import GuestListDisplay from "@/components/guest-list/GuestListDisplay";
import {
  GuestListData,
  UpdateGuestPayload,
  SortOption,
} from "@/components/guest-list/guestList.types";
import { DbInvitationGroupWithGuests } from "@/database/drizzle";
import { useDebounce } from "@/hooks/useDebounce";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AddGuestDialog } from "@/components/guest-list/AddGuestDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GuestListPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("alpha-asc");
  const [offset, setOffset] = useState(0);
  const [accumulatedGuests, setAccumulatedGuests] = useState<
    DbInvitationGroupWithGuests[]
  >([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [nameFormat, setNameFormat] = useState<"FIRST_NAME_ONLY" | "FULL_NAME">(
    "FULL_NAME"
  );

  const limit = 25;

  const {
    data,
    isFetching: isFetchingGuestList,
    isLoading: isLoadingGuestList,
    isError: isErrorGuestList,
  } = useQuery<GuestListData>({
    queryKey: ["guest-list", sortBy, offset],
    queryFn: async () => {
      const res = await fetch(
        `/api/guest-list?sortBy=${sortBy}&limit=${limit}&offset=${offset}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch guest list");
      }
      const result = await res.json();
      return result;
    },
  });

  useEffect(() => {
    if (data?.guestListWithGroups) {
      if (offset === 0) {
        setAccumulatedGuests(data.guestListWithGroups);
      } else {
        setAccumulatedGuests((prev) => {
          const existingIds = new Set(prev.map((g) => g.id));
          const newGuests = data.guestListWithGroups.filter(
            (g) => !existingIds.has(g.id)
          );
          return [...prev, ...newGuests];
        });
      }
    }
  }, [data, offset]);

  const { data: searchData, isLoading: isSearching } = useQuery<{
    results: DbInvitationGroupWithGuests[];
    count: number;
  }>({
    queryKey: ["guest-list-search", debouncedSearchQuery, sortBy],
    queryFn: async () => {
      if (!debouncedSearchQuery) {
        return { results: [], count: 0 };
      }
      const res = await fetch(
        `/api/guest-list/search?query=${encodeURIComponent(
          debouncedSearchQuery
        )}&sortBy=${sortBy}`
      );
      if (!res.ok) {
        throw new Error("Search failed");
      }
      return res.json();
    },
    enabled: debouncedSearchQuery.length > 0,
  });

  const { data: nameFormatData } = useQuery<{
    nameFormat: "FIRST_NAME_ONLY" | "FULL_NAME";
  }>({
    queryKey: ["rsvp-name-format"],
    queryFn: async () => {
      const res = await fetch("/api/settings/rsvp-name-format");
      if (!res.ok) {
        throw new Error("Failed to fetch name format");
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (nameFormatData?.nameFormat) {
      setNameFormat(nameFormatData.nameFormat);
    }
  }, [nameFormatData]);

  const updateNameFormatMutation = useMutation({
    mutationFn: async (newFormat: "FIRST_NAME_ONLY" | "FULL_NAME") => {
      const response = await fetch("/api/settings/rsvp-name-format", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nameFormat: newFormat }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update name format");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rsvp-name-format"] });
    },
    onError: (error) => {
      console.error("Error updating name format:", error);
    },
  });

  const updateGuestMutation = useMutation({
    mutationFn: async (payload: UpdateGuestPayload) => {
      const { entryId, ...rest } = payload;
      const response = await fetch("/api/guest-list", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invitationId: entryId, ...rest }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update guest");
      }

      return response.json();
    },
    onSuccess: () => {
      setEditingId(null);
      setOffset(0);
      setAccumulatedGuests([]);
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
    onError: (error) => {
      console.error("Error updating guest:", error);
    },
  });

  const addGuestMutation = useMutation({
    mutationFn: async (data: { guests: string[]; hasPlusOne: boolean }) => {
      const response = await fetch("/api/guest-list/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add guest");
      }

      return response.json();
    },
    onSuccess: () => {
      setIsAddDialogOpen(false);
      setOffset(0);
      setAccumulatedGuests([]);
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
    onError: (error) => {
      console.error("Error adding guest:", error);
    },
  });

  const deleteGuestMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const response = await fetch("/api/guest-list/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete guest");
      }

      return response.json();
    },
    onSuccess: () => {
      setOffset(0);
      setAccumulatedGuests([]);
      queryClient.invalidateQueries({ queryKey: ["guest-list"] });
    },
    onError: (error) => {
      console.error("Error deleting guest:", error);
    },
  });

  const guestListCount = data?.guestListCount ?? 0;
  const guestListWithGroupsCount = data?.guestListWithGroupsCount ?? 0;
  const plusOneCount = data?.plusOneCount ?? 0;
  const hasMore = data?.hasMore ?? false;

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    setOffset(0);
    setAccumulatedGuests([]);
  };

  const handleNameFormatChange = (newFormat: string) => {
    const format = newFormat as "FIRST_NAME_ONLY" | "FULL_NAME";
    setNameFormat(format);
    updateNameFormatMutation.mutate(format);
  };

  const isInitialLoading =
    isLoadingGuestList ||
    (isFetchingGuestList && accumulatedGuests.length === 0);

  if (isInitialLoading) {
    return <LoadingSpinner message="Loading guest list..." />;
  }

  if (isErrorGuestList) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full mb-4 mt-20">
          <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600 mb-4">
                Try again or check back later
              </p>
              <Button
                onClick={() => {
                  setOffset(0);
                  setAccumulatedGuests([]);
                  queryClient.invalidateQueries({ queryKey: ["guest-list"] });
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full mb-4 mt-20">
        <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
          <SignedIn>
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-1">Guest List</h1>
              <p className="text-stone-700 text-sm mb-3">
                Guests may RSVP by entering the name entered on their
                invitation.
              </p>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="name-format"
                  className="text-sm font-medium text-gray-700"
                >
                  RSVP Name Format:
                </label>
                <Select
                  value={nameFormat}
                  onValueChange={handleNameFormatChange}
                  disabled={updateNameFormatMutation.isPending}
                >
                  <SelectTrigger id="name-format" className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_NAME">Full Name</SelectItem>
                    <SelectItem value="FIRST_NAME_ONLY">
                      First Name Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center">
                <p className="text-2xl font-semibold font-handwritten-font">
                  {guestListWithGroupsCount}
                </p>
                <p className="text-stone-700 text-sm">Invitations</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center">
                <p className="text-2xl font-semibold font-handwritten-font">
                  {guestListCount}
                </p>
                <p className="text-stone-700 text-sm">Expected Guests</p>
              </div>
              <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center">
                <p className="text-2xl font-semibold font-handwritten-font">
                  {plusOneCount}
                </p>
                <p className="text-stone-700 text-sm">Plus Ones</p>
              </div>
            </div>

            <div className="mb-6">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add Guest
              </Button>
            </div>

            <AddGuestDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onSubmit={(data) => addGuestMutation.mutate(data)}
              isSubmitting={addGuestMutation.isPending}
            />

            <GuestListDisplay
              guestListWithGroups={accumulatedGuests}
              onUpdateGuest={(payload) => updateGuestMutation.mutate(payload)}
              onDeleteGuest={(entryId) => deleteGuestMutation.mutate(entryId)}
              isUpdating={updateGuestMutation.isPending}
              editingId={editingId}
              onEditingIdChange={setEditingId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchResults={searchData?.results ?? null}
              searchResultsCount={searchData?.count ?? 0}
              isSearching={isSearching}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              isSorting={isFetchingGuestList && offset === 0}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              isLoadingMore={isFetchingGuestList && offset > 0}
            />
          </SignedIn>
          <SignedOut>
            <div className="my-6">
              <p className="text-stone-700 font-handwritten-font text-2xl text-center">
                Please sign in to view the guest list.
              </p>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}

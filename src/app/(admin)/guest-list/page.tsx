"use client";

import { useState } from "react";
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

export default function GuestListPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingGuestList, setLoadingGuestList] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("alpha-asc");
  const [offset, setOffset] = useState(0);
  const [accumulatedGuests, setAccumulatedGuests] = useState<
    DbInvitationGroupWithGuests[]
  >([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const limit = 25;

  const { data, isFetching: isFetchingGuestList } = useQuery<GuestListData>({
    queryKey: ["guest-list", sortBy, offset],
    queryFn: async () => {
      const res = await fetch(
        `/api/guest-list?sortBy=${sortBy}&limit=${limit}&offset=${offset}`
      );
      setLoadingGuestList(false);
      const result = await res.json();

      if (offset === 0) {
        setAccumulatedGuests(result.guestListWithGroups);
      } else {
        setAccumulatedGuests((prev) => [
          ...prev,
          ...result.guestListWithGroups,
        ]);
      }

      return result;
    },
  });

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

  const updateGuestMutation = useMutation({
    mutationFn: async (payload: UpdateGuestPayload) => {
      const response = await fetch("/api/guest-list", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
    mutationFn: async (entryId: number) => {
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

  if (loadingGuestList) {
    return <LoadingSpinner message="Loading guest list..." />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full mb-4 mt-20">
        <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
          <SignedIn>
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-1">Guest List</h1>
              <p className="text-stone-700 text-sm">
                Guests may RSVP by entering the name entered on their
                invitation.
              </p>
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

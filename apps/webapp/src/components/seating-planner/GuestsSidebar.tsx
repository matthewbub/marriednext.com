"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { GuestListResponse } from "@/lib/admin/guestListService";
import type { DbGuest } from "@/database/drizzle";
import { clsx } from "clsx";

const GUESTS_PER_PAGE = 25;

async function fetchGuests({ pageParam = 0 }): Promise<GuestListResponse> {
  const response = await fetch(
    `/api/guest-list?sortBy=alpha-asc&limit=${GUESTS_PER_PAGE}&offset=${pageParam}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch guests");
  }
  return response.json();
}

function GuestCard({ guest }: { guest: DbGuest }) {
  const getRsvpStatusColor = (isAttending: boolean | null) => {
    if (isAttending === true) return "bg-green-500";
    if (isAttending === false) return "bg-red-500";
    return "bg-yellow-500";
  };

  const getRsvpStatusText = (isAttending: boolean | null) => {
    if (isAttending === true) return "Yes";
    if (isAttending === false) return "No";
    return "Pending";
  };

  return (
    <div className="p-3 bg-surface border border-subtle rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">
            {guest.nameOnInvitation}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={clsx(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white",
                getRsvpStatusColor(guest.isAttending)
              )}
            >
              {getRsvpStatusText(guest.isAttending)}
            </span>
            {guest.hasPlusOne && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                +1
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function GuestsSidebar() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["guests"],
    queryFn: fetchGuests,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasMore) {
        return lastPage.currentOffset + lastPage.currentLimit;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allGuests = data?.pages.flatMap((page) => page.guestList) ?? [];

  return (
    <aside className="w-64 p-6 bg-surface border border-subtle rounded-lg flex-shrink-0 flex flex-col max-h-[calc(100vh-200px)]">
      <h2 className="text-lg font-semibold mb-4">Guests</h2>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {isError && (
        <div className="text-sm text-red-500 p-4 bg-red-500/10 rounded">
          Failed to load guests. Please try again.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {allGuests.map((guest) => (
              <GuestCard key={guest.id} guest={guest} />
            ))}

            <div ref={sentinelRef} className="h-4" />

            {isFetchingNextPage && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              {allGuests.length} guest{allGuests.length !== 1 ? "s" : ""} loaded
            </p>
            {!hasNextPage && allGuests.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                All guests loaded
              </p>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

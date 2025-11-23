"use client";

import { useState, useEffect, useRef } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useSeatingPlannerStore,
  type Shape,
} from "@/stores/seatingPlannerStore";
import type { GuestListResponse } from "@/lib/admin/guestListService";
import type { DbGuest } from "@/database/drizzle";
import { clsx } from "clsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus, GripVertical } from "lucide-react";
import {
  draggable,
  dropTargetForElements,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useDebounce } from "@/hooks/useDebounce";

const GUESTS_PER_PAGE = 50;

async function fetchGuests({ pageParam = 0 }): Promise<GuestListResponse> {
  const response = await fetch(
    `/api/guest-list?sortBy=alpha-asc&limit=${GUESTS_PER_PAGE}&offset=${pageParam}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch guests");
  }
  return response.json();
}

async function assignSeat(data: {
  tableId: string;
  guestId: string;
  seatPosition: number;
}) {
  const response = await fetch("/api/seating-planner/seats", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to assign seat");
  }
  return response.json();
}

async function removeSeat(data: { tableId: string; guestId: string }) {
  const response = await fetch(
    `/api/seating-planner/seats?tableId=${data.tableId}&guestId=${data.guestId}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to remove seat");
  }
  return response.json();
}

async function reorderSeats(data: { tableId: string; guestIds: string[] }) {
  const response = await fetch("/api/seating-planner/seats", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to reorder seats");
  }
  return response.json();
}

async function updateTableName(data: { id: string; tableName: string }) {
  const response = await fetch("/api/seating-planner/tables", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update table name");
  }
  return response.json();
}

interface DraggableGuestItemProps {
  guest: DbGuest;
  index: number;
  onRemove: () => void;
  getRsvpStatusText: (isAttending: boolean | null) => string;
}

function DraggableGuestItem({
  guest,
  index,
  onRemove,
  getRsvpStatusText,
}: DraggableGuestItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const cleanupDraggable = draggable({
      element,
      getInitialData: () => ({ guestId: guest.id, index }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    });

    const cleanupDropTarget = dropTargetForElements({
      element,
      getData: () => ({ index }),
      onDragEnter: () => setIsOver(true),
      onDragLeave: () => setIsOver(false),
      onDrop: () => setIsOver(false),
    });

    return () => {
      cleanupDraggable();
      cleanupDropTarget();
    };
  }, [guest.id, index]);

  return (
    <div
      ref={ref}
      className={clsx(
        "flex items-center gap-2 p-2 bg-surface rounded border transition-all",
        isDragging && "opacity-50",
        isOver && "border-primary",
        !isDragging && !isOver && "border-subtle"
      )}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {guest.nameOnInvitation}
          </span>
          {guest.hasPlusOne && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
              +1
            </span>
          )}
        </div>
        <p
          className={clsx(
            "text-xs italic",
            guest.isAttending === true && "text-green-600",
            guest.isAttending === false && "text-red-600",
            guest.isAttending === null && "text-yellow-600"
          )}
        >
          {getRsvpStatusText(guest.isAttending)}
        </p>
      </div>
      <Button size="sm" variant="outline" onClick={onRemove}>
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface TableAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  shape: Shape | null;
}

export function TableAssignmentModal({
  open,
  onClose,
  shape: initialShape,
}: TableAssignmentModalProps) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [localTableName, setLocalTableName] = useState("");
  const hasUserEditedRef = useRef(false);
  const debouncedTableName = useDebounce(localTableName, 500);
  const {
    shapes,
    addGuestToShape,
    removeGuestFromShape,
    updateTableName: updateTableNameStore,
    reorderGuests: reorderGuestsStore,
  } = useSeatingPlannerStore();

  const assignSeatMutation = useMutation({
    mutationFn: assignSeat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-tables"] });
    },
  });

  const removeSeatMutation = useMutation({
    mutationFn: removeSeat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-tables"] });
    },
  });

  const reorderSeatsMutation = useMutation({
    mutationFn: reorderSeats,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-tables"] });
    },
  });

  const updateTableNameMutation = useMutation({
    mutationFn: updateTableName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-tables"] });
    },
  });

  const shape = initialShape
    ? shapes.find((s) => s.id === initialShape.id)
    : null;

  useEffect(() => {
    if (shape) {
      setLocalTableName(shape.tableName || "");
      hasUserEditedRef.current = false;
    }
  }, [shape?.id, shape?.tableName]);

  useEffect(() => {
    if (
      shape &&
      hasUserEditedRef.current &&
      debouncedTableName !== (shape.tableName || "")
    ) {
      updateTableNameStore(shape.id, debouncedTableName);
      updateTableNameMutation.mutate({
        id: shape.id,
        tableName: debouncedTableName,
      });
    }
  }, [
    debouncedTableName,
    shape?.id,
    shape?.tableName,
    updateTableNameStore,
    updateTableNameMutation,
  ]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["guests-modal"],
      queryFn: fetchGuests,
      getNextPageParam: (lastPage) => {
        if (lastPage.hasMore) {
          return lastPage.currentOffset + lastPage.currentLimit;
        }
        return undefined;
      },
      initialPageParam: 0,
      enabled: open,
    });

  const allGuests = data?.pages.flatMap((page) => page.guestList) ?? [];

  const isGuestAssignedToThisTable = (guestId: string) => {
    return shape?.guestIds.includes(guestId) ?? false;
  };

  const getGuestTableAssignment = (guestId: string): Shape | null => {
    return shapes.find((s) => s.guestIds.includes(guestId)) || null;
  };

  const assignedGuests = shape
    ? shape.guestIds
        .map((id) => allGuests.find((g) => g.id === id))
        .filter((g): g is DbGuest => g !== undefined)
    : [];

  const guestsAssignedToOtherTables = allGuests.filter((guest) => {
    const assignedTable = getGuestTableAssignment(guest.id);
    return assignedTable && assignedTable.id !== shape?.id;
  });

  const availableGuests = allGuests
    .filter((guest) => !getGuestTableAssignment(guest.id))
    .filter((guest) =>
      searchQuery
        ? guest.nameOnInvitation
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true
    );

  const filteredAssignedToOthers = guestsAssignedToOtherTables.filter((guest) =>
    searchQuery
      ? guest.nameOnInvitation.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const assignedGuestsCount = assignedGuests.reduce((count, guest) => {
    return count + (guest.hasPlusOne ? 2 : 1);
  }, 0);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        if (!shape) return;

        const sourceData = source.data as { guestId: string; index: number };
        const destination = location.current.dropTargets[0];

        if (!destination) return;

        const destinationData = destination.data as { index: number };
        const sourceIndex = sourceData.index;
        const destinationIndex = destinationData.index;

        if (sourceIndex === destinationIndex) return;

        const newGuestIds = [...shape.guestIds];
        const [movedId] = newGuestIds.splice(sourceIndex, 1);
        newGuestIds.splice(destinationIndex, 0, movedId);

        reorderGuestsStore(shape.id, newGuestIds);
        reorderSeatsMutation.mutate({
          tableId: shape.id,
          guestIds: newGuestIds,
        });
      },
    });
  }, [shape, reorderGuestsStore, reorderSeatsMutation]);

  const handleAddGuest = (guestId: string) => {
    if (shape) {
      const seatPosition = shape.guestIds.length;
      addGuestToShape(shape.id, guestId);
      assignSeatMutation.mutate({
        tableId: shape.id,
        guestId,
        seatPosition,
      });
    }
  };

  const handleRemoveGuest = (guestId: string) => {
    if (shape) {
      removeGuestFromShape(shape.id, guestId);
      removeSeatMutation.mutate({
        tableId: shape.id,
        guestId,
      });
    }
  };

  const handleMoveGuestFromAnotherTable = (guestId: string) => {
    const currentTable = getGuestTableAssignment(guestId);
    if (shape && currentTable) {
      removeGuestFromShape(currentTable.id, guestId);
      removeSeatMutation.mutate(
        {
          tableId: currentTable.id,
          guestId,
        },
        {
          onSuccess: () => {
            const seatPosition = shape.guestIds.length;
            addGuestToShape(shape.id, guestId);
            assignSeatMutation.mutate({
              tableId: shape.id,
              guestId,
              seatPosition,
            });
          },
        }
      );
    }
  };

  const getRsvpStatusText = (isAttending: boolean | null) => {
    if (isAttending === true) return "Attending";
    if (isAttending === false) return "No";
    return "Pending";
  };

  const getTableTypeName = (type: string) => {
    if (type === "square") return "Square Table";
    if (type === "rectangle") return "Rectangle Table";
    if (type === "circle") return "Round Table";
    return "Table";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Assign Guests to Table</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Add guests to this table by clicking the plus icon.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-name">Table Name</Label>
            <Input
              id="table-name"
              placeholder={getTableTypeName(shape?.type || "")}
              value={localTableName}
              onChange={(e) => {
                hasUserEditedRef.current = true;
                setLocalTableName(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex gap-4">
          <div className="flex-1 space-y-2 flex flex-col overflow-hidden">
            <div className="flex flex-col">
              <h3 className="font-semibold text-sm">
                Assigned Guests ({assignedGuestsCount})
              </h3>
              <span className="text-xs text-muted-foreground">
                (Drag to reorder)
              </span>
            </div>
            <div className="border border-subtle rounded-lg p-3 flex-1 overflow-y-auto">
              {assignedGuests.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No guests assigned yet
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedGuests.map((guest, index) => (
                    <DraggableGuestItem
                      key={guest.id}
                      guest={guest}
                      index={index}
                      onRemove={() => handleRemoveGuest(guest.id)}
                      getRsvpStatusText={getRsvpStatusText}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-2 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-2">
              <Input
                placeholder="Search guests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 max-w-xs"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <>
                  {availableGuests.length === 0 &&
                  filteredAssignedToOthers.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchQuery ? "No guests found" : "No guests available"}
                    </p>
                  ) : (
                    <>
                      {availableGuests.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                            AVAILABLE GUESTS
                          </h3>
                          <div className="space-y-2">
                            {availableGuests.map((guest) => (
                              <div
                                key={guest.id}
                                className="flex items-center justify-between p-2 bg-surface rounded border border-subtle hover:border-primary/30 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium truncate">
                                      {guest.nameOnInvitation}
                                    </span>
                                    {guest.hasPlusOne && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                                        +1
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className={clsx(
                                      "text-xs italic",
                                      guest.isAttending === true &&
                                        "text-green-600",
                                      guest.isAttending === false &&
                                        "text-red-600",
                                      guest.isAttending === null &&
                                        "text-yellow-600"
                                    )}
                                  >
                                    {getRsvpStatusText(guest.isAttending)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAddGuest(guest.id)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          {hasNextPage && !searchQuery && (
                            <div className="flex justify-center pt-4">
                              <Button
                                variant="outline"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                              >
                                {isFetchingNextPage
                                  ? "Loading..."
                                  : "Load More"}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {filteredAssignedToOthers.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-muted-foreground mb-2">
                            ASSIGNED TO OTHER TABLES
                          </h3>
                          <div className="space-y-2">
                            {filteredAssignedToOthers.map((guest) => {
                              const assignedTable = getGuestTableAssignment(
                                guest.id
                              );
                              return (
                                <div
                                  key={guest.id}
                                  className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded border-2 border-yellow-400/50 dark:border-yellow-600/50"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium truncate">
                                        {guest.nameOnInvitation}
                                      </span>
                                      {guest.hasPlusOne && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary">
                                          +1
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <p
                                        className={clsx(
                                          "text-xs italic",
                                          guest.isAttending === true &&
                                            "text-green-600",
                                          guest.isAttending === false &&
                                            "text-red-600",
                                          guest.isAttending === null &&
                                            "text-yellow-600"
                                        )}
                                      >
                                        {getRsvpStatusText(guest.isAttending)}
                                      </p>
                                      <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-500">
                                        Currently at:{" "}
                                        {assignedTable?.tableName ||
                                          getTableTypeName(
                                            assignedTable?.type || ""
                                          )}
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      handleMoveGuestFromAnotherTable(guest.id)
                                    }
                                    className="hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

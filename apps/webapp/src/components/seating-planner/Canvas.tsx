"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useSeatingPlannerStore,
  type Shape,
  getShapeDimensions,
} from "@/stores/seatingPlannerStore";
import { TableAssignmentModal } from "./TableAssignmentModal";
import { NameDistributor } from "./NameDistributor";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type {
  DbSeatingTable,
  DbSeatAssignment,
  DbGuest,
} from "@/database/drizzle";

interface DraggedCanvasItem {
  id: string;
  offsetX: number;
  offsetY: number;
}

type DbTableWithAssignments = DbSeatingTable & {
  seatAssignments: DbSeatAssignment[];
};

interface TablesResponse {
  tables: DbTableWithAssignments[];
}

async function fetchTables(): Promise<TablesResponse> {
  const response = await fetch("/api/seating-planner/tables");
  if (!response.ok) {
    throw new Error("Failed to fetch tables");
  }
  return response.json();
}

async function fetchGuests(): Promise<{ guests: DbGuest[] }> {
  const response = await fetch(
    "/api/guest-list?sortBy=alpha-asc&limit=100&offset=0"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch guests");
  }
  const data = await response.json();
  return { guests: data.guestList || [] };
}

async function createTable(data: {
  type: "square" | "rectangle" | "circle";
  x: number;
  y: number;
  tableName?: string;
}) {
  const response = await fetch("/api/seating-planner/tables", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create table");
  }
  return response.json();
}

async function updateTable(data: {
  id: string;
  x?: number;
  y?: number;
  tableName?: string;
}) {
  const response = await fetch("/api/seating-planner/tables", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update table");
  }
  return response.json();
}

export function Canvas() {
  const queryClient = useQueryClient();
  const { shapes, setShapes, addShape, updateShapePosition, checkCollision } =
    useSeatingPlannerStore();
  const [draggedCanvasItem, setDraggedCanvasItem] =
    useState<DraggedCanvasItem | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllNames, setShowAllNames] = useState(false);
  const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["seating-tables"],
    queryFn: fetchTables,
  });

  const { data: guestsData } = useQuery({
    queryKey: ["canvas-guests"],
    queryFn: fetchGuests,
  });

  const createTableMutation = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-tables"] });
    },
  });

  const updateTableMutation = useMutation({
    mutationFn: updateTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seating-tables"] });
    },
  });

  useEffect(() => {
    if (data?.tables) {
      const newShapes: Shape[] = data.tables.map((table) => ({
        id: table.id,
        type: table.type,
        x: table.x,
        y: table.y,
        tableName: table.tableName || undefined,
        guestIds: table.seatAssignments.map((sa) => sa.guestId),
      }));

      setShapes(newShapes);
    }
  }, [data, setShapes]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const shapeData = e.dataTransfer.getData("shape");
    if (shapeData) {
      const draggedShape = JSON.parse(shapeData);
      const x = Math.max(0, e.clientX - canvasRect.left - draggedShape.offsetX);
      const y = Math.max(0, e.clientY - canvasRect.top - draggedShape.offsetY);

      const newShape: Shape = {
        id: `${draggedShape.type}-${Date.now()}`,
        type: draggedShape.type,
        x,
        y,
        guestIds: [],
      };

      if (!checkCollision(newShape)) {
        addShape(newShape);
        createTableMutation.mutate({
          type: draggedShape.type,
          x,
          y,
        });
      }
    }

    if (draggedCanvasItem) {
      const x = Math.max(
        0,
        e.clientX - canvasRect.left - draggedCanvasItem.offsetX
      );
      const y = Math.max(
        0,
        e.clientY - canvasRect.top - draggedCanvasItem.offsetY
      );

      const updatedShape = shapes.find((s) => s.id === draggedCanvasItem.id);
      if (updatedShape) {
        const newPosition = { ...updatedShape, x, y };

        if (!checkCollision(newPosition, draggedCanvasItem.id)) {
          updateShapePosition(draggedCanvasItem.id, x, y);
          updateTableMutation.mutate({
            id: draggedCanvasItem.id,
            x,
            y,
          });
        }
      }
      setDraggedCanvasItem(null);
    }
  };

  const handleCanvasItemDragStart = (e: React.DragEvent, shapeId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedCanvasItem({
      id: shapeId,
      offsetX,
      offsetY,
    });

    e.stopPropagation();
  };

  const handleShapeClick = (shape: Shape) => {
    setSelectedShape(shape);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedShape(null);
  };

  const getGuestNames = (guestIds: string[]): string[] => {
    if (!guestsData?.guests) return [];
    return guestIds
      .map((id) => {
        const guest = guestsData.guests.find((g) => g.id === id);
        return guest?.nameOnInvitation || null;
      })
      .filter((name): name is string => name !== null);
  };

  const renderShape = (shape: Shape) => {
    const isBeingDragged = draggedCanvasItem?.id === shape.id;
    const guestCount = shape.guestIds.length;
    const isHovered = hoveredShapeId === shape.id;
    const shouldShowNames = showAllNames || isHovered;
    const dimensions = getShapeDimensions(shape.type);
    const guestNames = shouldShowNames ? getGuestNames(shape.guestIds) : [];

    const commonClasses = `absolute border-2 border-primary bg-primary/20 cursor-move hover:bg-primary/30 transition-colors ${
      isBeingDragged ? "opacity-50" : ""
    }`;

    const style = {
      left: shape.x,
      top: shape.y,
    };

    const dragProps = {
      draggable: true,
      onDragStart: (e: React.DragEvent) =>
        handleCanvasItemDragStart(e, shape.id),
      onClick: () => handleShapeClick(shape),
      onMouseEnter: () => setHoveredShapeId(shape.id),
      onMouseLeave: () => setHoveredShapeId(null),
    };

    const renderContent = () => {
      if (guestNames.length > 0) {
        return (
          <NameDistributor
            names={guestNames}
            containerType={shape.type}
            containerWidth={dimensions.width}
            containerHeight={dimensions.height}
            nameWidth={shape.type === "rectangle" ? 70 : 50}
          />
        );
      }

      if (guestCount > 0) {
        return (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-sm font-semibold text-primary">
              {guestCount}
            </span>
          </div>
        );
      }

      return null;
    };

    switch (shape.type) {
      case "square":
        return (
          <div
            key={shape.id}
            className={`${commonClasses} w-15 h-15 relative`}
            style={style}
            {...dragProps}
          >
            {renderContent()}
          </div>
        );
      case "rectangle":
        return (
          <div
            key={shape.id}
            className={`${commonClasses} w-30 h-15 relative`}
            style={style}
            {...dragProps}
          >
            {renderContent()}
          </div>
        );
      case "circle":
        return (
          <div
            key={shape.id}
            className={`${commonClasses} w-15 h-15 rounded-full relative`}
            style={style}
            {...dragProps}
          >
            {renderContent()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <section className="flex-1 relative overflow-hidden bg-surface border border-subtle rounded-lg flex flex-col">
        <div className="p-4 border-b border-subtle flex items-center gap-2">
          <Checkbox
            id="show-all-names"
            checked={showAllNames}
            onCheckedChange={(checked) => setShowAllNames(checked === true)}
          />
          <Label
            htmlFor="show-all-names"
            className="text-sm font-medium cursor-pointer"
          >
            Show all names
          </Label>
        </div>
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex-1 w-full relative bg-muted/10 border-2 border-dashed border-muted-foreground/20"
        >
          <div className="absolute inset-4 pointer-events-none">
            <p className="text-muted-foreground text-center">
              Drop shapes here
            </p>
          </div>

          {shapes.map(renderShape)}
        </div>
      </section>

      <TableAssignmentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        shape={selectedShape}
      />
    </>
  );
}

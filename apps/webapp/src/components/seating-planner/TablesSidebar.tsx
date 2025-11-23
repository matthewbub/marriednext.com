"use client";

import type React from "react";
import { useSeatingPlannerStore } from "@/stores/seatingPlannerStore";

export function TablesSidebar() {
  const shapes = useSeatingPlannerStore((state) => state.shapes);

  const handleDragStart = (
    e: React.DragEvent,
    shapeType: "square" | "rectangle" | "circle"
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    e.dataTransfer.setData(
      "shape",
      JSON.stringify({
        type: shapeType,
        offsetX,
        offsetY,
      })
    );
  };

  return (
    <aside className="w-64 p-6 bg-surface border border-subtle rounded-lg flex-shrink-0">
      <h2 className="text-lg font-semibold mb-4">Tables</h2>
      <div className="space-y-4">
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "square")}
          className="w-15 h-15 bg-primary/20 border-2 border-primary cursor-grab active:cursor-grabbing hover:bg-primary/30 transition-colors"
          title="Square"
        />
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "rectangle")}
          className="w-30 h-15 bg-primary/20 border-2 border-primary cursor-grab active:cursor-grabbing hover:bg-primary/30 transition-colors"
          title="Rectangle"
        />
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, "circle")}
          className="w-15 h-15 bg-primary/20 border-2 border-primary rounded-full cursor-grab active:cursor-grabbing hover:bg-primary/30 transition-colors"
          title="Circle"
        />
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Drag tables onto the canvas
        </p>
        {shapes.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {shapes.length} table{shapes.length !== 1 ? "s" : ""} on canvas
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Drag placed tables to reposition
        </p>
      </div>
    </aside>
  );
}


import { create } from "zustand";

export interface Shape {
  id: string;
  type: "square" | "rectangle" | "circle";
  x: number;
  y: number;
  guestIds: string[];
  tableName?: string;
}

export const getShapeDimensions = (type: "square" | "rectangle" | "circle") => {
  switch (type) {
    case "square":
    case "circle":
      return { width: 60, height: 60 };
    case "rectangle":
      return { width: 120, height: 60 };
  }
};

interface SeatingPlannerStore {
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;
  addShape: (shape: Shape) => void;
  updateShapePosition: (id: string, x: number, y: number) => void;
  removeShape: (id: string) => void;
  checkCollision: (
    newShape: { x: number; y: number; type: string },
    excludeId?: string
  ) => boolean;
  addGuestToShape: (shapeId: string, guestId: string) => void;
  removeGuestFromShape: (shapeId: string, guestId: string) => void;
  updateTableName: (shapeId: string, tableName: string) => void;
  reorderGuests: (shapeId: string, guestIds: string[]) => void;
}

export const useSeatingPlannerStore = create<SeatingPlannerStore>(
  (set, get) => ({
    shapes: [],

    setShapes: (shapes) => {
      set({ shapes });
    },

    addShape: (shape) => {
      set((state) => ({
        shapes: [...state.shapes, { ...shape, guestIds: shape.guestIds || [] }],
      }));
    },

    updateShapePosition: (id, x, y) => {
      set((state) => ({
        shapes: state.shapes.map((shape) =>
          shape.id === id ? { ...shape, x, y } : shape
        ),
      }));
    },

    removeShape: (id) => {
      set((state) => ({
        shapes: state.shapes.filter((shape) => shape.id !== id),
      }));
    },

    checkCollision: (newShape, excludeId) => {
      const { shapes } = get();
      const newDimensions = getShapeDimensions(
        newShape.type as "square" | "rectangle" | "circle"
      );

      return shapes.some((existingShape) => {
        if (excludeId && existingShape.id === excludeId) return false;

        const existingDimensions = getShapeDimensions(existingShape.type);

        return !(
          newShape.x >= existingShape.x + existingDimensions.width ||
          newShape.x + newDimensions.width <= existingShape.x ||
          newShape.y >= existingShape.y + existingDimensions.height ||
          newShape.y + newDimensions.height <= existingShape.y
        );
      });
    },

    addGuestToShape: (shapeId, guestId) => {
      set((state) => ({
        shapes: state.shapes.map((shape) =>
          shape.id === shapeId && !shape.guestIds.includes(guestId)
            ? { ...shape, guestIds: [...shape.guestIds, guestId] }
            : shape
        ),
      }));
    },

    removeGuestFromShape: (shapeId, guestId) => {
      set((state) => ({
        shapes: state.shapes.map((shape) =>
          shape.id === shapeId
            ? {
                ...shape,
                guestIds: shape.guestIds.filter((id) => id !== guestId),
              }
            : shape
        ),
      }));
    },

    updateTableName: (shapeId, tableName) => {
      set((state) => ({
        shapes: state.shapes.map((shape) =>
          shape.id === shapeId ? { ...shape, tableName } : shape
        ),
      }));
    },

    reorderGuests: (shapeId, guestIds) => {
      set((state) => ({
        shapes: state.shapes.map((shape) =>
          shape.id === shapeId ? { ...shape, guestIds } : shape
        ),
      }));
    },
  })
);

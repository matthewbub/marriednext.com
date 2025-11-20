import type { Meta } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";
import React from "react";

/**
 * A component that renders items arranged in a square shape.
 */
export const SquareTableWithPositions = ({
  itemCount,
}: {
  itemCount: number;
}) => {
  // Create an array of length 'itemCount' for mapping
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const containerSize = 250; // Size of the square container (e.g., 250px)
  const itemSize = 40; // Diameter/size of the individual items (e.g., 40px)
  const availableSpace = containerSize - itemSize; // Space items can move within

  return (
    <div
      className="mn-table-square"
      style={{
        width: containerSize,
        height: containerSize,
        position: "relative",
        border: "1px solid black", // Optional: visualize the container
      }}
    >
      {items.map((item, index) => {
        // Calculate the number of items per side (approx)
        const itemsPerSide = Math.ceil(itemCount / 4);

        let x = 0;
        let y = 0;

        // --- Calculate positions for a square layout ---

        if (index < itemsPerSide) {
          // Top side (0% y, distributed across x)
          x = (index / (itemsPerSide - 1)) * availableSpace;
          y = 0;
        } else if (index < itemsPerSide * 2) {
          // Right side (100% x, distributed across y)
          x = availableSpace;
          y = ((index - itemsPerSide) / (itemsPerSide - 1)) * availableSpace;
        } else if (index < itemsPerSide * 3) {
          // Bottom side (100% y, distributed across x backwards)
          x =
            (1 - (index - itemsPerSide * 2) / (itemsPerSide - 1)) *
            availableSpace;
          y = availableSpace;
        } else {
          // Left side (0% x, distributed across y backwards)
          x = 0;
          y =
            (1 - (index - itemsPerSide * 3) / (itemsPerSide - 1)) *
            availableSpace;
        }

        // Handle edge case for itemCount=1
        if (itemCount === 1) {
          x = availableSpace / 2;
          y = availableSpace / 2;
        }

        // Ensure values are within bounds
        x = Math.max(0, Math.min(availableSpace, x));
        y = Math.max(0, Math.min(availableSpace, y));

        return (
          <div
            key={item}
            className="square-item"
            style={{
              position: "absolute",
              width: itemSize,
              height: itemSize,
              backgroundColor: "#007bff", // Example styling
              borderRadius: "50%", // Makes items circles within the square layout
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              // Position the top-left corner of the item at the calculated (x, y)
              left: `${x}px`,
              top: `${y}px`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};

const meta = {
  title: "Public/SquareTableWithPositions",
  component: SquareTableWithPositions,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  args: {
    itemCount: 8, // Try 4, 8, or 12 for best results
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SquareTableWithPositions>;

export default meta;
// type Story = StoryObj<typeof meta>;

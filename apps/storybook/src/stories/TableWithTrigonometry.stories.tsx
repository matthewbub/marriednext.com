import type { Meta } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";

export const TableWithTrigonometry = ({ itemCount }: { itemCount: number }) => {
  // Create an array of length 'itemCount' for mapping
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const radius = 125; // Half of the parent circle's height/width (250px / 2)
  const itemSize = 40; // Diameter of the individual items

  return (
    <div className="mn-table-circle">
      {items.map((item, index) => {
        // Calculate angle for each item in radians
        const angle = (index / itemCount) * 2 * Math.PI;
        // Calculate x and y positions using cosine and sine
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <div
            key={item}
            className="circle-item"
            style={{
              // Position the center of the item relative to the center of the container
              left: `calc(50% + ${x - itemSize / 2}px)`,
              top: `calc(50% + ${y - itemSize / 2}px)`,
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
  title: "Public/TableWithTrigonometry",
  component: TableWithTrigonometry,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  args: {
    itemCount: 8,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TableWithTrigonometry>;

export default meta;
// type Story = StoryObj<typeof meta>;

import { tableWithTrigonometryDefaults } from "./TableWithTrigonometry.constants";
import type { TableWithTrigonometryTypes } from "./TableWithTrigonometry.types";

export const TableWithTrigonometry = ({
  itemCount = tableWithTrigonometryDefaults.itemCount,
}: TableWithTrigonometryTypes) => {
  const items = Array.from({ length: itemCount }, (_, i) => i + 1);
  const radius = 125;
  const itemSize = 40;

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

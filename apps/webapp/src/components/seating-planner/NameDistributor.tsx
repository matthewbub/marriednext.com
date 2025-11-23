"use client";

import type React from "react";
import { useMemo } from "react";

interface NameDistributorProps {
  names: string[];
  containerType?: "circle" | "square" | "rectangle";
  containerWidth?: number;
  containerHeight?: number;
  nameWidth?: number;
}

export function NameDistributor({
  names,
  containerType = "circle",
  containerWidth = 60,
  containerHeight = 60,
  nameWidth = 50,
}: NameDistributorProps) {
  const positions = useMemo(() => {
    const count = names.length;
    if (count === 0) return [];

    const baseRadius = Math.min(containerWidth, containerHeight) / 2;
    const radius = baseRadius + 18;
    const angleSlice = (360 / count) * (Math.PI / 180);

    return names.map((_, index) => {
      const angle = angleSlice * index - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        x,
        y,
        angle: (angle * 180) / Math.PI,
      };
    });
  }, [names, containerWidth, containerHeight]);

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
  };

  return (
    <div style={containerStyle} className="relative">
      {names.map((name, index) => {
        const pos = positions[index];
        return (
          <div
            key={`${name}-${index}`}
            style={{
              position: "absolute",
              left: `calc(50% + ${pos.x}px)`,
              top: `calc(50% + ${pos.y}px)`,
              transform: "translate(-50%, -50%)",
              width: nameWidth,
            }}
            className="flex items-center justify-center"
          >
            <span
              className="text-[10px] font-medium text-center text-primary-foreground bg-primary/90 px-1 py-0.5 rounded whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
              title={name}
            >
              {name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

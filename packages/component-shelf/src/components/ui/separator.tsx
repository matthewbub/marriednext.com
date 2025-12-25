"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "../../lib/utils";

interface SeparatorProps {
  className?: string;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

// Style 1: Classic Flourish with Hearts
export function SeparatorHearts({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-20 bg-border" />
      <span className="text-sm">❦</span>
      <span className="text-xs">✦</span>
      <span className="text-lg">♡</span>
      <span className="text-xs">✦</span>
      <span className="text-sm">❦</span>
      <div className="h-px flex-1 max-w-20 bg-border" />
    </div>
  );
}

// Style 2: Elegant Diamonds
export function SeparatorDiamonds({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-24 bg-border" />
      <span className="text-xs">◇</span>
      <span className="text-xs">◆</span>
      <span className="text-base">❖</span>
      <span className="text-xs">◆</span>
      <span className="text-xs">◇</span>
      <div className="h-px flex-1 max-w-24 bg-border" />
    </div>
  );
}

// Style 3: Fleur-de-lis (Royal)
export function SeparatorFleurDeLis({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-16 bg-border" />
      <span className="text-sm">✧</span>
      <span className="text-xl">⚜</span>
      <span className="text-sm">✧</span>
      <div className="h-px flex-1 max-w-16 bg-border" />
    </div>
  );
}

// Style 4: Botanical / Floral
export function SeparatorFloral({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-20 bg-border" />
      <span className="text-sm">❀</span>
      <span className="text-xs">·</span>
      <span className="text-base">✿</span>
      <span className="text-xs">·</span>
      <span className="text-sm">❀</span>
      <div className="h-px flex-1 max-w-20 bg-border" />
    </div>
  );
}

// Style 5: Starlight / Celestial
export function SeparatorStars({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-20 bg-border" />
      <span className="text-xs">✦</span>
      <span className="text-sm">⋆</span>
      <span className="text-base">✧</span>
      <span className="text-sm">⋆</span>
      <span className="text-xs">✦</span>
      <div className="h-px flex-1 max-w-20 bg-border" />
    </div>
  );
}

// Style 6: Infinity / Eternal Love
export function SeparatorInfinity({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-24 bg-border" />
      <span className="text-xl tracking-wide">∞</span>
      <div className="h-px flex-1 max-w-24 bg-border" />
    </div>
  );
}

// Style 7: Classic Ornamental
export function SeparatorOrnamental({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-16 bg-border" />
      <span className="text-sm">☙</span>
      <span className="text-xs">―</span>
      <span className="text-base">❧</span>
      <div className="h-px flex-1 max-w-16 bg-border" />
    </div>
  );
}

// Style 8: Minimal Dots
export function SeparatorDots({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-24 bg-border" />
      <span className="text-xs">·</span>
      <span className="text-xs">•</span>
      <span className="text-sm">●</span>
      <span className="text-xs">•</span>
      <span className="text-xs">·</span>
      <div className="h-px flex-1 max-w-24 bg-border" />
    </div>
  );
}

// Style 9: Teardrop Asterisk
export function SeparatorAsterisk({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-20 bg-border" />
      <span className="text-sm">✤</span>
      <span className="text-lg">❋</span>
      <span className="text-sm">✤</span>
      <div className="h-px flex-1 max-w-20 bg-border" />
    </div>
  );
}

// Style 10: Simple & Elegant
export function SeparatorSimple({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-28 bg-border" />
      <span className="text-lg">✦</span>
      <div className="h-px flex-1 max-w-28 bg-border" />
    </div>
  );
}

// Style 11: Double Line Formal
export function SeparatorDoubleLine({ className }: SeparatorProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1 py-6", className)}>
      <div className="flex items-center gap-4 w-full max-w-xs">
        <div className="h-px flex-1 bg-border" />
        <span className="text-muted-foreground text-sm">❖</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex items-center w-full max-w-[200px]">
        <div className="h-px flex-1 bg-border/50" />
      </div>
    </div>
  );
}

// Style 12: Vine / Nature
export function SeparatorVine({ className }: SeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-1 py-6 text-muted-foreground",
        className
      )}
    >
      <div className="h-px flex-1 max-w-12 bg-border" />
      <span className="text-sm">❧</span>
      <span className="text-xs">―</span>
      <span className="text-sm">✿</span>
      <span className="text-xs">―</span>
      <span className="text-sm scale-x-[-1] inline-block">❧</span>
      <div className="h-px flex-1 max-w-12 bg-border" />
    </div>
  );
}

export { Separator };

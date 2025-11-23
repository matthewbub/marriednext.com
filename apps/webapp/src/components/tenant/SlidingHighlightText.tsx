"use client";

import { useState, useEffect, useRef } from "react";

interface ScrollHighlightTextProps {
  text: string;
  highlightColor?: string;
  fadedColor?: string;
  className?: string;
}

// We can't wait to have you there to share in the joy. Everything you need is right here: timing, venue details, what to wear, where to stay, plus a simple way to let us know you're coming.
export function ScrollHighlightText({
  text,
  highlightColor = "text-foreground",
  fadedColor = "text-muted-foreground",
  className = "",
}: ScrollHighlightTextProps) {
  const [highlightProgress, setHighlightProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate the scroll progress based on container position
      // When container top reaches window center, start highlighting
      const windowCenter = window.innerHeight / 2;

      // Calculate progress (0 to 1) based on scroll position
      const maxScroll = window.innerHeight;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (windowCenter - containerRect.top) / maxScroll)
      );

      setHighlightProgress(scrollProgress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Split text into characters for granular highlighting
  const characters = text.split("");
  const highlightedCount = Math.ceil(characters.length * highlightProgress);

  return (
    <div
      ref={containerRef}
      className={`text-4xl font-bold leading-tight ${className}`}
    >
      {characters.map((char, index) => (
        <span
          key={index}
          className={`transition-colors duration-300 ${
            index < highlightedCount ? highlightColor : fadedColor
          }`}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

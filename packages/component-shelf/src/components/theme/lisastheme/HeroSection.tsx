"use client";

import "style-shelf/tailwind-hybrid";
import { useEffect, useState } from "react";
import type React from "react";

interface HeroSectionProps {
  nameA: string | null;
  nameB: string | null;
  eventDate?: string | null;
  location?: string | null;
  imageUrl?: string;
  imageComponent?: React.ReactNode;
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function HeroSection({
  nameA,
  nameB,
  eventDate,
  location,
  imageUrl,
  imageComponent,
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = formatDate(eventDate);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        {imageComponent ? (
          <div className="w-full h-full [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
            {imageComponent}
          </div>
        ) : (
          <img
            src={
              imageUrl ||
              "/romantic-vineyard-wedding-venue-at-golden-hour-wit.jpg"
            }
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c2c2c]/50 via-[#2c2c2c]/30 to-[#faf9f6]" />
      </div>

      <div
        className={`relative z-10 text-center px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <p className="text-white/90 tracking-[0.4em] uppercase text-sm mb-6">
          We're Getting Married
        </p>

        <h1 className="font-serif text-white">
          {nameA && (
            <span className="block text-7xl md:text-8xl lg:text-9xl font-light italic mb-2">
              {nameA}
            </span>
          )}
          <span className="block text-2xl md:text-3xl tracking-[0.5em] uppercase font-sans font-light my-6">
            &
          </span>
          {nameB && (
            <span className="block text-7xl md:text-8xl lg:text-9xl font-light italic">
              {nameB}
            </span>
          )}
        </h1>

        {formattedDate && (
          <div className="mt-12 flex items-center justify-center gap-8 text-white/90">
            <span className="w-16 h-px bg-white/40" />
            <p className="tracking-[0.3em] uppercase text-sm">
              {formattedDate}
            </p>
            <span className="w-16 h-px bg-white/40" />
          </div>
        )}

        {location && (
          <p className="mt-4 text-white/80 tracking-[0.2em] uppercase text-sm">
            {location}
          </p>
        )}
      </div>
    </section>
  );
}

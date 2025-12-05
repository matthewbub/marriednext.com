"use client";

import "style-shelf/tailwind";
import { useEffect, useState } from "react";
import type { HeroSectionCustomization, HeroSectionProps } from "./types";
import labels from "label-shelf/lisastheme";
import { EditableLabel } from "../../ui/editable-label";
import { cn } from "@/lib/utils";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const defaultHeroLabels = {
  subtitleLabel: labels["lisastheme.hero.pretext.label"],
};

export function HeroSection({
  data,
  customization,
  editable = false,
  contained = false,
  onCustomizationChange,
}: HeroSectionProps) {
  const mergedCustomization = {
    ...defaultHeroLabels,
    ...customization,
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const formattedDate = formatDate(data?.eventDate);

  const handleChange = (key: keyof HeroSectionCustomization, value: string) => {
    onCustomizationChange?.(key, value);
  };

  return (
    <section
      id="home"
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden",
        contained && "mt-[-75px]"
      )}
    >
      <div className="absolute inset-0">
        {data?.imageComponent ? (
          <div className="w-full h-full [&>img]:w-full [&>img]:h-full [&>img]:object-cover">
            {data?.imageComponent}
          </div>
        ) : (
          <img
            src={
              data?.imageUrl ||
              "https://4ctc36zdopsyz0ok.public.blob.vercel-storage.com/photos/placeholders/cody-chan-7jgtAhJkjwk-unsplash.jpg"
            }
            alt=""
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-[#2c2c2c]/50 via-[#2c2c2c]/30 to-[#faf9f6]" />
      </div>

      <div
        className={cn(
          `relative z-10 text-center px-6 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`,
          contained && "mt-[95px] pb-[90px]"
        )}
      >
        {mergedCustomization.subtitleLabel && (
          <EditableLabel
            as="p"
            value={mergedCustomization.subtitleLabel}
            editable={editable}
            onChange={(v) => handleChange("subtitleLabel", v)}
            className="text-white/90 tracking-[0.4em] uppercase text-sm mb-6"
          />
        )}

        <h1 className="font-serif text-white">
          {data?.nameA && (
            <span className="block text-7xl md:text-8xl lg:text-9xl font-light italic mb-2">
              {data?.nameA}
            </span>
          )}
          <span className="block text-2xl md:text-3xl tracking-[0.5em] uppercase font-sans font-light my-6">
            &
          </span>
          {data?.nameB && (
            <span className="block text-7xl md:text-8xl lg:text-9xl font-light italic">
              {data?.nameB}
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

        {data?.location && (
          <p className="mt-4 text-white/80 tracking-[0.2em] uppercase text-sm">
            {data?.location}
          </p>
        )}
      </div>
    </section>
  );
}

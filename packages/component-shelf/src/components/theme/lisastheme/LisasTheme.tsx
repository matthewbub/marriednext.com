"use client";

import "style-shelf/tailwind-hybrid";
import type React from "react";
import labels from "label-shelf/lisastheme";
import { StickyNav } from "./StickyNav";
import { HeroSection } from "./HeroSection";
import { CountdownSection } from "./CountdownSection";
import { OurStorySection } from "./OurStorySection";
import { EventDetailsSection } from "./EventDetailsSection";
import { GallerySection } from "./GallerySection";
import { RsvpSection } from "./RsvpSection";
import { FooterSection } from "./FooterSection";

export interface LisasThemeTypes {
  fieldNameA: string | null;
  fieldNameB: string | null;
  fieldLocationName?: string | null;
  fieldLocationAddress?: string | null;
  fieldEventDate?: string | null;
  fieldEventTime?: string | null;
  fieldMapsShareUrl?: string | null;
  heroImageUrl?: string;
  heroImageComponent?: React.ReactNode;
  rsvpFormComponent?: React.ReactNode;
  ourStoryImageUrl?: string;
  ourStoryImageComponent?: React.ReactNode;
}

export function LisasTheme({
  fieldNameA,
  fieldNameB,
  fieldLocationName,
  fieldLocationAddress,
  fieldEventDate,
  fieldEventTime,
  fieldMapsShareUrl,
  heroImageUrl,
  heroImageComponent,
  ourStoryImageUrl,
  ourStoryImageComponent,
}: LisasThemeTypes) {
  return (
    <div className="min-h-screen">
      <StickyNav />
      <HeroSection
        nameA={fieldNameA}
        nameB={fieldNameB}
        eventDate={fieldEventDate}
        location={fieldLocationName}
        imageUrl={heroImageUrl}
        imageComponent={heroImageComponent}
      />
      <CountdownSection eventDate={fieldEventDate} />
      <OurStorySection
        nameA={fieldNameA}
        nameB={fieldNameB}
        imageUrl={ourStoryImageUrl}
        imageComponent={ourStoryImageComponent}
      />
      <EventDetailsSection
        locationName={fieldLocationName}
        locationAddress={fieldLocationAddress}
        eventDate={fieldEventDate}
        eventTime={fieldEventTime}
        mapsShareUrl={fieldMapsShareUrl}
      />
      <GallerySection />
      <RsvpSection />
      <FooterSection
        nameA={fieldNameA}
        nameB={fieldNameB}
        eventDate={fieldEventDate}
        location={fieldLocationName}
      />
    </div>
  );
}

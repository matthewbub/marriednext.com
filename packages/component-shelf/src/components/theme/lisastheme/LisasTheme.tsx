"use client";

import "style-shelf/tailwind-hybrid";
import type { LisasThemeTypes } from "./types";
import { StickyNav } from "./StickyNav";
import { HeroSection } from "./HeroSection";
import { CountdownSection } from "./CountdownSection";
import { OurStorySection } from "./OurStorySection";
import { EventDetailsSection } from "./EventDetailsSection";
import { GallerySection } from "./GallerySection";
import { FaqSection } from "./FaqSection";
import { RsvpSection } from "./RsvpSection";
import { FooterSection } from "./FooterSection";

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
  rsvpFormComponent,
  ourStoryImageUrl,
  ourStoryImageComponent,
}: LisasThemeTypes) {
  return (
    <div className="min-h-screen">
      <StickyNav />
      <HeroSection
        data={{
          nameA: fieldNameA,
          nameB: fieldNameB,
          eventDate: fieldEventDate,
          location: fieldLocationName,
          imageUrl: heroImageUrl,
          imageComponent: heroImageComponent,
        }}
      />
      <div suppressHydrationWarning>
        <CountdownSection data={{ eventDate: fieldEventDate }} />
      </div>
      <OurStorySection
        data={{
          nameA: fieldNameA,
          nameB: fieldNameB,
          imageUrl: ourStoryImageUrl,
          imageComponent: ourStoryImageComponent,
        }}
      />
      <EventDetailsSection
        data={{
          locationName: fieldLocationName,
          locationAddress: fieldLocationAddress,
          eventDate: fieldEventDate,
          eventTime: fieldEventTime,
          mapsShareUrl: fieldMapsShareUrl,
        }}
      />
      <GallerySection data={{}} />
      <FaqSection data={{}} />
      <RsvpSection data={{ rsvpFormComponent }} />
      <FooterSection
        data={{
          nameA: fieldNameA,
          nameB: fieldNameB,
          eventDate: fieldEventDate,
          location: fieldLocationName,
        }}
      />
    </div>
  );
}

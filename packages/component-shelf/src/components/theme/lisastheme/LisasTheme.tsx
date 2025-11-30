"use client";

import "style-shelf/tailwind";
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
  editable = true,
  onCustomizationChange,
}: LisasThemeTypes) {
  const handleSectionChange =
    (section: string) => (key: string, value: string) => {
      onCustomizationChange?.(section, key, value);
    };

  return (
    <div className="min-h-screen">
      <StickyNav
        editable={editable}
        onCustomizationChange={handleSectionChange("stickyNav")}
      />
      <HeroSection
        data={{
          nameA: fieldNameA,
          nameB: fieldNameB,
          eventDate: fieldEventDate,
          location: fieldLocationName,
          imageUrl: heroImageUrl,
          imageComponent: heroImageComponent,
        }}
        editable={editable}
        onCustomizationChange={handleSectionChange("hero")}
      />
      <div suppressHydrationWarning>
        <CountdownSection
          data={{ eventDate: fieldEventDate }}
          editable={editable}
          onCustomizationChange={handleSectionChange("countdown")}
        />
      </div>
      <OurStorySection
        data={{
          nameA: fieldNameA,
          nameB: fieldNameB,
          imageUrl: ourStoryImageUrl,
          imageComponent: ourStoryImageComponent,
        }}
        editable={editable}
        onCustomizationChange={handleSectionChange("ourStory")}
      />
      <EventDetailsSection
        data={{
          locationName: fieldLocationName,
          locationAddress: fieldLocationAddress,
          eventDate: fieldEventDate,
          eventTime: fieldEventTime,
          mapsShareUrl: fieldMapsShareUrl,
        }}
        editable={editable}
        onCustomizationChange={handleSectionChange("eventDetails")}
      />
      <GallerySection
        data={{}}
        editable={editable}
        onCustomizationChange={handleSectionChange("gallery")}
      />
      <FaqSection
        data={{}}
        editable={editable}
        onCustomizationChange={handleSectionChange("faq")}
      />
      <RsvpSection
        data={{ rsvpFormComponent }}
        editable={editable}
        onCustomizationChange={handleSectionChange("rsvp")}
      />
      <FooterSection
        data={{
          nameA: fieldNameA,
          nameB: fieldNameB,
          eventDate: fieldEventDate,
          location: fieldLocationName,
        }}
        editable={editable}
        onCustomizationChange={handleSectionChange("footer")}
      />
    </div>
  );
}

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
import { mergeSectionsWithDefaults } from "./sections";

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
  galleryImages,
  websiteSections,
  editable = false,
  contained = false,
  onCustomizationChange,
}: LisasThemeTypes) {
  const handleSectionChange =
    (section: string) => (key: string, value: string) => {
      onCustomizationChange?.(section, key, value);
    };

  const sections = mergeSectionsWithDefaults(websiteSections);
  const sectionsMap = new Map(sections.map((s) => [s.id, s]));

  const isSectionEnabled = (sectionId: string) => {
    return sectionsMap.get(sectionId)?.enabled ?? true;
  };

  return (
    <div className="min-h-screen">
      <StickyNav
        editable={editable}
        contained={contained}
        onCustomizationChange={handleSectionChange("stickyNav")}
      />
      {isSectionEnabled("hero") && (
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
      )}
      {isSectionEnabled("countdown") && (
        <div suppressHydrationWarning>
          <CountdownSection
            data={{ eventDate: fieldEventDate }}
            editable={editable}
            onCustomizationChange={handleSectionChange("countdown")}
          />
        </div>
      )}
      {isSectionEnabled("ourStory") && (
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
      )}
      {isSectionEnabled("eventDetails") && (
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
      )}
      {isSectionEnabled("gallery") && (
        <GallerySection
          data={{
            images:
              galleryImages && galleryImages.length > 0
                ? galleryImages.map((url) => ({ src: url }))
                : undefined,
          }}
          editable={editable}
          onCustomizationChange={handleSectionChange("gallery")}
        />
      )}
      {isSectionEnabled("faq") && (
        <FaqSection
          data={{}}
          editable={editable}
          onCustomizationChange={handleSectionChange("faq")}
        />
      )}
      {isSectionEnabled("rsvp") && (
        <RsvpSection
          data={{ rsvpFormComponent }}
          editable={editable}
          onCustomizationChange={handleSectionChange("rsvp")}
        />
      )}
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

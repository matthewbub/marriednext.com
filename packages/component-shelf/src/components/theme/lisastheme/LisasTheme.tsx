"use client";

import "style-shelf/tailwind";
import labels from "label-shelf/lisastheme";
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
import SideNavigation from "../defaults/SideNavigation";

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
  websiteLabels,
  editable = false,
  contained = false,
  onCustomizationChange,
}: LisasThemeTypes) {
  const handleSectionChange =
    (section: string) => (key: string, value: string) => {
      onCustomizationChange?.(section, key, value);
    };

  const getSectionLabels = (sectionId: string) => {
    const defaults: Record<
      string,
      Record<string, string | Record<string, string>>
    > = {
      stickyNav: {
        navLabels: {
          home: labels["lisastheme.nav.home.label"],
          story: labels["lisastheme.nav.story.label"],
          details: labels["lisastheme.nav.details.label"],
          gallery: labels["lisastheme.nav.gallery.label"],
          rsvp: labels["lisastheme.nav.rsvp.label"],
        },
      },
      hero: {
        subtitleLabel: labels["lisastheme.hero.pretext.label"],
      },
      countdown: {
        pretextLabel: labels["lisastheme.countdown.pretext.label"],
        daysLabel: labels["lisastheme.countdown.days.label"],
        hoursLabel: labels["lisastheme.countdown.hours.label"],
        minutesLabel: labels["lisastheme.countdown.minutes.label"],
        secondsLabel: labels["lisastheme.countdown.seconds.label"],
      },
      ourStory: {
        pretitleLabel: labels["lisastheme.ourstory.pretitle.label"],
        titleLabel: labels["lisastheme.ourstory.title.label"],
        sectionTextLabel: labels["lisastheme.ourstory.section.text.label"],
        sectionSubtextLabel:
          labels["lisastheme.ourstory.section.subtext.label"],
      },
      eventDetails: {
        headingPretextLabel: labels["lisastheme.details.pretitle.label"],
        headingLabel: labels["lisastheme.details.title.label"],
        ceremonyHeadingLabel: labels["lisastheme.details.ceremony.title.label"],
        ceremonyDescriptionLabel:
          labels["lisastheme.details.ceremony.text.label"],
        venueHeadingLabel: labels["lisastheme.details.venue.title.label"],
        viewMapLabel: labels["lisastheme.details.venue.button.label"],
        celebrationHeadingLabel:
          labels["lisastheme.details.celebration.title.label"],
        celebrationDescriptionLabel:
          labels["lisastheme.details.celebration.text.1.label"],
        celebrationAttireLabel:
          labels["lisastheme.details.celebration.text.2.label"],
        dressCodeSectionLabel:
          labels["lisastheme.details.dresscode.pretitle.label"],
        dressCodeValueLabel: labels["lisastheme.details.dresscode.title.label"],
        dressCodeNoteLabel: labels["lisastheme.details.dresscode.text.label"],
      },
      gallery: {
        pretitleLabel: labels["lisastheme.moments.pretitle.label"],
        titleLabel: labels["lisastheme.moments.title.label"],
        imageAltLabel: labels["lisastheme.moments.image.alt.label"],
      },
      faq: {
        pretitleLabel: labels["lisastheme.faq.section.pretitle.label"],
        titleLabel: labels["lisastheme.faq.section.title.label"],
        noteLabel: labels["lisastheme.faq.section.intro.label"],
        noteLinkLabel: labels["lisastheme.faq.note.link.label"],
        noteLinkHref: labels["lisastheme.faq.note.link.href"],
      },
      rsvp: {
        pretitleLabel: labels["lisastheme.rsvp.pretitle.label"],
        titleLabel: labels["lisastheme.rsvp.title.label"],
        descriptionLabel: labels["lisastheme.rsvp.text.label"],
        searchPlaceholderLabel:
          labels["lisastheme.rsvp.search.placeholder.label"],
        searchButtonLabel: labels["lisastheme.rsvp.search.button.label"],
        invitationLabel:
          labels["lisastheme.rsvp.search.results.pretitle.label"],
        questionLabel: labels["lisastheme.rsvp.search.question.label"],
        acceptButtonLabel: labels["lisastheme.rsvp.search.accept.label"],
        declineButtonLabel: labels["lisastheme.rsvp.search.decline.label"],
        confirmationHeadingLabel:
          labels["lisastheme.rsvp.confirmation.heading.label"],
        confirmationTextLabel:
          labels["lisastheme.rsvp.confirmation.text.label"],
      },
      footer: {
        pretitleLabel: labels["lisastheme.footer.pretitle.label"],
        signatureLabel: labels["lisastheme.footer.signature.label"],
      },
    };

    const sectionDefaults = defaults[sectionId] || {};
    const userOverrides = websiteLabels?.[sectionId] || {};

    const merged: Record<string, string | Record<string, string>> = {
      ...sectionDefaults,
    };

    for (const [key, value] of Object.entries(userOverrides)) {
      if (
        key === "navLabels" &&
        typeof sectionDefaults.navLabels === "object" &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        merged.navLabels = {
          ...(sectionDefaults.navLabels as Record<string, string>),
          ...(value as Record<string, string>),
        };
      } else {
        merged[key] = value;
      }
    }

    return merged;
  };

  const sections = mergeSectionsWithDefaults(websiteSections);
  const sectionsMap = new Map(sections.map((s) => [s.id, s]));

  const isSectionEnabled = (sectionId: string) => {
    return sectionsMap.get(sectionId)?.enabled ?? true;
  };

  return (
    <div className="min-h-screen @container">
      <StickyNav
        customization={getSectionLabels("stickyNav")}
        editable={editable}
        contained={contained}
        onCustomizationChange={handleSectionChange("stickyNav")}
      />
      <SideNavigation
        navLinks={[
          { label: "Home", href: "#home" },
          { label: "Story", href: "#story" },
          { label: "Details", href: "#details" },
          { label: "Gallery", href: "#gallery" },
          { label: "RSVP", href: "#rsvp" },
        ]}
        getNavItemClass={() =>
          "text-stone-700 hover:text-stone-900 transition-colors"
        }
        ariaLabel="Main navigation"
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
          customization={getSectionLabels("hero")}
          editable={editable}
          contained={contained}
          onCustomizationChange={handleSectionChange("hero")}
        />
      )}
      {isSectionEnabled("countdown") && (
        <div suppressHydrationWarning>
          <CountdownSection
            data={{ eventDate: fieldEventDate }}
            customization={getSectionLabels("countdown")}
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
          customization={getSectionLabels("ourStory")}
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
          customization={getSectionLabels("eventDetails")}
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
          customization={getSectionLabels("gallery")}
          editable={editable}
          onCustomizationChange={handleSectionChange("gallery")}
        />
      )}
      {isSectionEnabled("faq") && (
        <FaqSection
          data={{}}
          customization={getSectionLabels("faq")}
          editable={editable}
          onCustomizationChange={handleSectionChange("faq")}
        />
      )}
      {isSectionEnabled("rsvp") && (
        <RsvpSection
          data={{ rsvpFormComponent }}
          customization={getSectionLabels("rsvp")}
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
        customization={getSectionLabels("footer")}
        editable={editable}
        onCustomizationChange={handleSectionChange("footer")}
      />
    </div>
  );
}

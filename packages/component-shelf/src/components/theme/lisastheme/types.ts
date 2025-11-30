import type { ReactNode } from "react";

/**
 * Top-level props for the LisasTheme component.
 * @database
 */
export interface LisasThemeTypes {
  fieldNameA: string | null;
  fieldNameB: string | null;
  fieldLocationName?: string | null;
  fieldLocationAddress?: string | null;
  fieldEventDate?: string | null;
  fieldEventTime?: string | null;
  fieldMapsShareUrl?: string | null;
  heroImageUrl?: string;
  heroImageComponent?: ReactNode;
  rsvpFormComponent?: ReactNode;
  ourStoryImageUrl?: string;
  ourStoryImageComponent?: ReactNode;
}

/**
 * Optional label customizations for HeroSection.
 * @customizable
 */
export interface HeroSectionCustomization {
  subtitleLabel?: string;
}

/**
 * Database-required fields for HeroSection.
 * @database
 */
export interface HeroSectionData {
  nameA: string | null;
  nameB: string | null;
  eventDate?: string | null;
  location?: string | null;
  imageUrl?: string;
  imageComponent?: ReactNode;
}

export interface HeroSectionProps {
  /** Required data from the database */
  data: HeroSectionData;
  /** Optional label/style customizations */
  customization?: HeroSectionCustomization;
}

/**
 * Optional label customizations for StickyNav.
 * @customizable
 */
export interface StickyNavCustomization {
  navLabels?: {
    home?: string;
    story?: string;
    details?: string;
    gallery?: string;
    rsvp?: string;
  };
}

export interface StickyNavProps {
  customization?: StickyNavCustomization;
}

/**
 * Optional label customizations for RsvpSection.
 * @customizable
 */
export interface RsvpSectionCustomization {
  pretitleLabel?: string;
  titleLabel?: string;
  descriptionLabel?: string;
  searchPlaceholderLabel?: string;
  searchButtonLabel?: string;
  invitationLabel?: string;
  questionLabel?: string;
  acceptButtonLabel?: string;
  declineButtonLabel?: string;
  confirmationHeadingLabel?: string;
  confirmationTextLabel?: string;
}

/**
 * Database-required fields for RsvpSection.
 * @database
 */
export interface RsvpSectionData {
  rsvpFormComponent?: ReactNode;
}

export interface RsvpSectionProps {
  /** Required data from the database */
  data?: RsvpSectionData;
  /** Optional label/style customizations */
  customization?: RsvpSectionCustomization;
}

/**
 * Optional label customizations for FooterSection.
 * @customizable
 */
export interface FooterSectionCustomization {
  pretitleLabel?: string;
  signatureLabel?: string;
}

/**
 * Database-required fields for FooterSection.
 * @database
 */
export interface FooterSectionData {
  nameA?: string | null;
  nameB?: string | null;
  eventDate?: string | null;
  location?: string | null;
}

export interface FooterSectionProps {
  /** Required data from the database */
  data: FooterSectionData;
  /** Optional label/style customizations */
  customization?: FooterSectionCustomization;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Optional label customizations for FaqSection.
 * @customizable
 */
export interface FaqSectionCustomization {
  pretitleLabel?: string;
  titleLabel?: string;
  noteLabel?: string;
  noteLinkLabel?: string;
  noteLinkHref?: string;
}

/**
 * Database-required fields for FaqSection.
 * @database
 */
export interface FaqSectionData {
  faqs?: FaqItem[];
}

export interface FaqSectionProps {
  /** Required data from the database */
  data: FaqSectionData;
  /** Optional label/style customizations */
  customization?: FaqSectionCustomization;
}

export interface Milestone {
  date: string;
  title: string;
  description: string;
}

/**
 * Optional label customizations for OurStorySection.
 * @customizable
 */
export interface OurStorySectionCustomization {
  pretitleLabel?: string;
  titleLabel?: string;
  sectionTextLabel?: string;
  sectionSubtextLabel?: string;
}

/**
 * Database-required fields for OurStorySection.
 * @database
 */
export interface OurStorySectionData {
  nameA?: string | null;
  nameB?: string | null;
  imageUrl?: string;
  imageComponent?: ReactNode;
  milestones?: Milestone[];
}

export interface OurStorySectionProps {
  /** Required data from the database */
  data: OurStorySectionData;
  /** Optional label/style customizations */
  customization?: OurStorySectionCustomization;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Optional label customizations for CountdownSection.
 * @customizable
 */
export interface CountdownSectionCustomization {
  pretextLabel?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
}

/**
 * Database-required fields for CountdownSection.
 * @database
 */
export interface CountdownSectionData {
  eventDate?: string | null;
}

export interface CountdownSectionProps {
  /** Required data from the database */
  data: CountdownSectionData;
  /** Optional label/style customizations */
  customization?: CountdownSectionCustomization;
}

export interface RegistryEntry {
  name: string;
  description: string;
  url: string;
}

/**
 * Optional customizations for RegistrySection.
 * @customizable
 */
export interface RegistrySectionCustomization {
  pretitleLabel?: string;
  titleLabel?: string;
  descriptionLabel?: string;
  entryButtonLabel?: string;
  noteLabel?: string;
  registries?: RegistryEntry[];
}

export interface RegistrySectionProps {
  customization?: RegistrySectionCustomization;
}

export interface GalleryImage {
  src: string;
  span?: string;
}

/**
 * Optional label customizations for GallerySection.
 * @customizable
 */
export interface GallerySectionCustomization {
  pretitleLabel?: string;
  titleLabel?: string;
  imageAltLabel?: string;
}

/**
 * Database-required fields for GallerySection.
 * @database
 */
export interface GallerySectionData {
  images?: GalleryImage[];
}

export interface GallerySectionProps {
  /** Required data from the database */
  data: GallerySectionData;
  /** Optional label/style customizations */
  customization?: GallerySectionCustomization;
}

/**
 * Optional label customizations for EventDetailsSection.
 * @customizable
 */
export interface EventDetailsSectionCustomization {
  headingPretextLabel?: string;
  headingLabel?: string;
  ceremonyHeadingLabel?: string;
  ceremonyDescriptionLabel?: string;
  venueHeadingLabel?: string;
  viewMapLabel?: string;
  celebrationHeadingLabel?: string;
  celebrationDescriptionLabel?: string;
  celebrationAttireLabel?: string;
  dressCodeSectionLabel?: string;
  dressCodeValueLabel?: string;
  dressCodeNoteLabel?: string;
}

/**
 * Database-required fields for EventDetailsSection.
 * @database
 */
export interface EventDetailsSectionData {
  locationName?: string | null;
  locationAddress?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  mapsShareUrl?: string | null;
}

export interface EventDetailsSectionProps {
  /** Required data from the database */
  data: EventDetailsSectionData;
  /** Optional label/style customizations */
  customization?: EventDetailsSectionCustomization;
}

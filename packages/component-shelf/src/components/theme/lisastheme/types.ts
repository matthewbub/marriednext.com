import type { ReactNode } from "react";

export type WebsiteSection = {
  id: string;
  enabled: boolean;
  order: number;
};

/**
 * Top-level props for the LisasTheme component.
 * @database
 */
export type WebsiteLabels = Record<string, Record<string, string>>;

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
  galleryImages?: string[];
  websiteSections?: WebsiteSection[] | null;
  websiteLabels?: WebsiteLabels | null;
  editable?: boolean;
  contained?: boolean;
  onCustomizationChange?: (section: string, key: string, value: string) => void;
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
  data: HeroSectionData;
  customization?: HeroSectionCustomization;
  editable?: boolean;
  contained?: boolean;
  onCustomizationChange?: (
    key: keyof HeroSectionCustomization,
    value: string
  ) => void;
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
  editable?: boolean;
  contained?: boolean;
  onCustomizationChange?: (
    key: keyof NonNullable<StickyNavCustomization["navLabels"]>,
    value: string
  ) => void;
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
  data?: RsvpSectionData;
  customization?: RsvpSectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof RsvpSectionCustomization,
    value: string
  ) => void;
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
  data: FooterSectionData;
  customization?: FooterSectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof FooterSectionCustomization,
    value: string
  ) => void;
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
  data: FaqSectionData;
  customization?: FaqSectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof FaqSectionCustomization,
    value: string
  ) => void;
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
  data: OurStorySectionData;
  customization?: OurStorySectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof OurStorySectionCustomization,
    value: string
  ) => void;
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
  data: CountdownSectionData;
  customization?: CountdownSectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof CountdownSectionCustomization,
    value: string
  ) => void;
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
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof RegistrySectionCustomization,
    value: string
  ) => void;
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
  data: GallerySectionData;
  customization?: GallerySectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof GallerySectionCustomization,
    value: string
  ) => void;
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
  data: EventDetailsSectionData;
  customization?: EventDetailsSectionCustomization;
  editable?: boolean;
  onCustomizationChange?: (
    key: keyof EventDetailsSectionCustomization,
    value: string
  ) => void;
}

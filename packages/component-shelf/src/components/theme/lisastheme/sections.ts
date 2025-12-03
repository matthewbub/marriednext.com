export type WebsiteSection = {
  id: string;
  enabled: boolean;
  order: number;
};

export const DEFAULT_SECTIONS: WebsiteSection[] = [
  { id: "hero", enabled: true, order: 0 },
  { id: "countdown", enabled: true, order: 1 },
  { id: "ourStory", enabled: true, order: 2 },
  { id: "eventDetails", enabled: true, order: 3 },
  { id: "gallery", enabled: true, order: 4 },
  { id: "rsvp", enabled: true, order: 5 },
  { id: "faq", enabled: true, order: 6 },
  { id: "registry", enabled: true, order: 7 },
];

export const SECTION_DISPLAY_NAMES: Record<string, string> = {
  hero: "Hero",
  countdown: "Countdown",
  ourStory: "Our Story",
  eventDetails: "Wedding Details",
  gallery: "Photo Gallery",
  rsvp: "RSVP Form",
  faq: "FAQ",
  registry: "Registry",
};

export function getDefaultSections(): WebsiteSection[] {
  return DEFAULT_SECTIONS.map((section) => ({ ...section }));
}

export function mergeSectionsWithDefaults(
  savedSections: WebsiteSection[] | null | undefined
): WebsiteSection[] {
  if (!savedSections || savedSections.length === 0) {
    return getDefaultSections();
  }

  const savedMap = new Map(savedSections.map((s) => [s.id, s]));
  const merged: WebsiteSection[] = [];

  for (const defaultSection of DEFAULT_SECTIONS) {
    const saved = savedMap.get(defaultSection.id);
    if (saved) {
      merged.push({
        id: saved.id,
        enabled: saved.enabled,
        order: saved.order,
      });
    } else {
      merged.push({ ...defaultSection });
    }
  }

  return merged.sort((a, b) => a.order - b.order);
}


export const enUS = {
  meta: {
    title: {
      default: "Yulissa and Matthew’s Wedding — April 23, 2026 — Temecula, CA",
      template: "%s | Yulissa and Matthew’s Wedding",
    },
    description:
      "Join us in Temecula, CA on April 23, 2026 to celebrate the wedding of Yulissa and Matthew. Find our story, photos, directions to the venue, FAQs, and registry information.",
  },
  header: {
    aria: {
      toggleNavigation: "Toggle navigation",
    },
    hero: {
      theWord: "The",
      weddingWord: " Wedding ",
      ofWord: "of",
      dateLocation: "April 23, 2026 • Temecula, CA",
      names: "Yulissa & Matthew",
    },
    nav: {
      home: "Home",
      ourStory: "Our Story",
      photos: "Photos",
      weddingParty: "Wedding Party",
      qAndA: "Q + A",
      travel: "Travel",
      registry: "Registry",
    },
    countdown: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
  },
  common: {
    backToHome: "Back to Home",
    comingSoon: {
      title: "Coming Soon",
      message:
        "We’re putting the finishing touches on this section. Please check back soon.",
    },
    credits: {
      madeBy: "This website was made by",
    },
  },
  pages: {
    home: {
      heroAlt: "Yulissa and Matthew",
      venueName: "Bel Vino Winery",
      addressLine1: "33515 Rancho California Road",
      addressLine2: "Temecula, CA 92591",
    },
    ourStory: { title: "Our Story" },
    photos: { title: "Photos" },
    qAndA: { title: "Q + A" },
    travel: { title: "Travel" },
    registry: { title: "Our Honeymoon Fund" },
    weddingParty: { title: "Wedding Party" },
  },
} as const;

export type LocaleEnUS = typeof enUS;

export type SupportedLocale = "en-US";

export function getLocale(_locale: SupportedLocale = "en-US"): LocaleEnUS {
  return enUS;
}

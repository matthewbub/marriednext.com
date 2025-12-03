export type WeddingPhoto = {
  id: string;
  themeId: string;
  photoType: "hero" | "story" | "gallery" | "memory";
  blobUrl: string;
  displayOrder: number;
};

export type WebsiteSection = {
  id: string;
  enabled: boolean;
  order: number;
};

export type WeddingData = {
  id: string;
  subdomain: string | null;
  customDomain: string | null;
  createdAt: string;
  updatedAt: string;
  fieldDisplayName: string | null;
  fieldLocationName: string | null;
  fieldLocationAddress: string | null;
  fieldEventDate: string | null;
  fieldEventTime: string | null;
  fieldMapsEmbedUrl: string | null;
  fieldMapsShareUrl: string | null;
  fieldQuestionsAndAnswers: unknown;
  fieldOurStory: unknown;
  fieldNameA: string | null;
  fieldNameB: string | null;
  controlRsvpNameFormat: "FIRST_NAME_ONLY" | "FULL_NAME";
  photos?: WeddingPhoto[];
  websiteSections?: WebsiteSection[] | null;
};

export type QA = {
  question: string;
  answer?: string;
  html?: string;
};

export type OurStorySection = {
  heading: string;
  id: string;
  photoUrl: string;
  text: string;
};

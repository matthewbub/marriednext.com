import { create } from "zustand";

export type PageId =
  | "home"
  | "our-story"
  | "photos"
  | "wedding-party"
  | "q-and-a"
  | "travel"
  | "registry";

export interface DateCountdownData {
  dateLocationText: string;
  countdownTargetUtc: string;
}

export interface LocationData {
  venueName: string;
  addressLine1: string;
  addressLine2: string;
  mapLink: string;
}

interface WebsiteBuilderState {
  selectedPage: PageId;
  scale: number;
  editMode: "photos" | "labels" | null;
  dateCountdown: DateCountdownData;
  location: LocationData;
  setSelectedPage: (page: PageId) => void;
  setScale: (scale: number) => void;
  setEditMode: (mode: "photos" | "labels" | null) => void;
  setDateCountdown: (data: DateCountdownData) => void;
  setLocation: (data: LocationData) => void;
}

export const useWebsiteBuilderStore = create<WebsiteBuilderState>((set) => ({
  selectedPage: "home",
  scale: 1,
  editMode: null,
  dateCountdown: {
    dateLocationText: "April 24, 2026 | Temecula, California",
    countdownTargetUtc: "2026-04-24T00:00:00Z",
  },
  location: {
    venueName: "Bel Vino Winery",
    addressLine1: "33515 Rancho California Road",
    addressLine2: "Temecula, CA 92591",
    mapLink: "https://maps.app.goo.gl/...",
  },
  setSelectedPage: (page) => set({ selectedPage: page }),
  setScale: (scale) => set({ scale }),
  setEditMode: (mode) => set({ editMode: mode }),
  setDateCountdown: (data) => set({ dateCountdown: data }),
  setLocation: (data) => set({ location: data }),
}));

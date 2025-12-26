import { create } from "zustand";

export type WebsiteLabels = Record<string, Record<string, string>>;

export type WebsiteSection = {
  id: string;
  enabled: boolean;
  order: number;
};

export type SelectedElement = {
  sectionId: string;
  labelKey?: string;
  currentValue?: string;
} | null;

interface WebsiteBuilderStore {
  savedLabels: WebsiteLabels;
  pendingLabels: WebsiteLabels;
  savedSections: WebsiteSection[];
  pendingSections: WebsiteSection[];
  selectedElement: SelectedElement;
  initializeLabels: (labels: WebsiteLabels) => void;
  initializeSections: (sections: WebsiteSection[]) => void;
  updateLabel: (section: string, key: string, value: string) => void;
  updateSection: (sectionId: string, enabled: boolean) => void;
  commitLabels: (labels: WebsiteLabels) => void;
  commitSections: (sections: WebsiteSection[]) => void;
  discardChanges: () => void;
  hasUnsavedChanges: () => boolean;
  setSelectedElement: (element: SelectedElement) => void;
  clearSelectedElement: () => void;
}

export const areLabelsEqual = (
  labels1: WebsiteLabels,
  labels2: WebsiteLabels
): boolean => {
  const keys1 = Object.keys(labels1);
  const keys2 = Object.keys(labels2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const section1 = labels1[key] || {};
    const section2 = labels2[key] || {};
    const sectionKeys1 = Object.keys(section1);
    const sectionKeys2 = Object.keys(section2);

    if (sectionKeys1.length !== sectionKeys2.length) {
      return false;
    }

    for (const sectionKey of sectionKeys1) {
      if (section1[sectionKey] !== section2[sectionKey]) {
        return false;
      }
    }
  }

  return true;
};

export const areSectionsEqual = (
  sections1: WebsiteSection[],
  sections2: WebsiteSection[]
): boolean => {
  if (sections1.length !== sections2.length) {
    return false;
  }

  const map1 = new Map(sections1.map((s) => [s.id, s]));
  const map2 = new Map(sections2.map((s) => [s.id, s]));

  for (const [id, section1] of map1.entries()) {
    const section2 = map2.get(id);
    if (
      !section2 ||
      section1.enabled !== section2.enabled ||
      section1.order !== section2.order
    ) {
      return false;
    }
  }

  return true;
};

export const useWebsiteBuilderStore = create<WebsiteBuilderStore>(
  (set, get) => ({
    savedLabels: {},
    pendingLabels: {},
    savedSections: [],
    pendingSections: [],
    selectedElement: null,

    initializeLabels: (labels) => {
      set({
        savedLabels: labels,
        pendingLabels: labels,
      });
    },

    initializeSections: (sections) => {
      set({
        savedSections: sections,
        pendingSections: sections,
      });
    },

    updateLabel: (section, key, value) => {
      set((state) => ({
        pendingLabels: {
          ...state.pendingLabels,
          [section]: {
            ...(state.pendingLabels[section] || {}),
            [key]: value,
          },
        },
      }));
    },

    updateSection: (sectionId, enabled) => {
      set((state) => ({
        pendingSections: state.pendingSections.map((section) =>
          section.id === sectionId ? { ...section, enabled } : section
        ),
      }));
    },

    commitLabels: (labels) => {
      set({
        savedLabels: labels,
        pendingLabels: labels,
      });
    },

    commitSections: (sections) => {
      set({
        savedSections: sections,
        pendingSections: sections,
      });
    },

    discardChanges: () => {
      set((state) => ({
        pendingLabels: state.savedLabels,
        pendingSections: state.savedSections,
      }));
    },

    hasUnsavedChanges: () => {
      const { savedLabels, pendingLabels, savedSections, pendingSections } =
        get();
      return (
        !areLabelsEqual(savedLabels, pendingLabels) ||
        !areSectionsEqual(savedSections, pendingSections)
      );
    },

    setSelectedElement: (element) => {
      set({ selectedElement: element });
    },

    clearSelectedElement: () => {
      set({ selectedElement: null });
    },
  })
);

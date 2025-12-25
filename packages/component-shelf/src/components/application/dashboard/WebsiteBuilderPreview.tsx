"use client";

import { useMemo, useEffect, useCallback } from "react";
import { useWebsiteBuilderStore } from "../../../stores/websiteBuilderStore";
import { LisasTheme } from "../../theme/lisastheme/LisasTheme";
import {
  mergeSectionsWithDefaults,
  type WebsiteSection,
} from "../../theme/lisastheme/sections";
import { postToParent, isBuilderMessage } from "../../../lib/builderMessages";

export type WebsiteBuilderPhoto = {
  id: string;
  themeId: string;
  photoType: "hero" | "story" | "gallery" | "memory";
  blobUrl: string;
  displayOrder: number;
};

export type WebsiteLabels = Record<string, Record<string, string>>;

export type WebsiteBuilderData = {
  fieldNameA: string | null;
  fieldNameB: string | null;
  fieldLocationName: string | null;
  fieldLocationAddress: string | null;
  fieldEventDate: string | null;
  fieldEventTime: string | null;
  fieldMapsShareUrl: string | null;
  photos?: WebsiteBuilderPhoto[];
  websiteSections?: WebsiteSection[] | null;
  websiteLabels?: WebsiteLabels | null;
  subdomain?: string | null;
  customDomain?: string | null;
  subscriptionPlan?: string;
};

export type WebsiteBuilderPreviewProps = {
  data?: WebsiteBuilderData;
  isLoading?: boolean;
};

const THEME_ID = "lisastheme";

export function WebsiteBuilderPreview({
  data,
  isLoading = false,
}: WebsiteBuilderPreviewProps) {
  const { pendingLabels, initializeLabels, updateLabel } =
    useWebsiteBuilderStore();

  const sections = useMemo<WebsiteSection[]>(
    () => mergeSectionsWithDefaults(data?.websiteSections),
    [data?.websiteSections]
  );

  const content = useMemo(() => {
    const heroPhoto = data?.photos?.find(
      (p) => p.photoType === "hero" && p.themeId === THEME_ID
    );
    const storyPhoto = data?.photos?.find(
      (p) => p.photoType === "story" && p.themeId === THEME_ID
    );
    const galleryPhotos =
      data?.photos
        ?.filter((p) => p.photoType === "gallery" && p.themeId === THEME_ID)
        ?.sort((a, b) => a.displayOrder - b.displayOrder)
        ?.map((p) => p.blobUrl) || [];

    return {
      heroImage: heroPhoto?.blobUrl || "",
      ourStoryImage: storyPhoto?.blobUrl || "",
      galleryImages: galleryPhotos,
    };
  }, [data?.photos]);

  useEffect(() => {
    if (data?.websiteLabels) {
      initializeLabels(data.websiteLabels);
    }
  }, [data?.websiteLabels, initializeLabels]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isBuilderMessage(event)) return;

      const message = event.data;
      if (message.type === "UPDATE_LABEL") {
        updateLabel(
          message.payload.sectionId,
          message.payload.labelKey,
          message.payload.value
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [updateLabel]);

  const handleCustomizationChange = (
    section: string,
    key: string,
    value: string
  ) => {
    updateLabel(section, key, value);
    postToParent({
      type: "LABEL_CLICKED",
      payload: { sectionId: section, labelKey: key, currentValue: value },
    });
  };

  const handleSectionClick = useCallback((sectionId: string) => {
    postToParent({
      type: "SECTION_CLICKED",
      payload: { sectionId, sectionName: sectionId },
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <p className="text-muted-foreground">No website data available</p>
      </div>
    );
  }

  return (
    <LisasTheme
      fieldNameA={data.fieldNameA}
      fieldNameB={data.fieldNameB}
      fieldLocationName={data.fieldLocationName}
      fieldLocationAddress={data.fieldLocationAddress}
      fieldEventDate={data.fieldEventDate}
      fieldEventTime={data.fieldEventTime}
      fieldMapsShareUrl={data.fieldMapsShareUrl}
      heroImageUrl={content.heroImage || undefined}
      ourStoryImageUrl={content.ourStoryImage || undefined}
      galleryImages={
        content.galleryImages.length > 0 ? content.galleryImages : undefined
      }
      websiteSections={sections}
      websiteLabels={pendingLabels}
      editable={true}
      contained={true}
      onCustomizationChange={handleCustomizationChange}
      onSectionClick={handleSectionClick}
    />
  );
}

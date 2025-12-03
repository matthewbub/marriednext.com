"use client";

import Image from "next/image";
import { LisasTheme } from "component-shelf";
import { useWeddingData } from "@/contexts/WeddingDataContext";

export default function Home() {
  const weddingData = useWeddingData();
  const themeId = "lisastheme";

  const heroPhoto = weddingData.photos?.find(
    (p) => p.photoType === "hero" && p.themeId === themeId
  );
  const storyPhoto = weddingData.photos?.find(
    (p) => p.photoType === "story" && p.themeId === themeId
  );
  const galleryPhotos =
    weddingData.photos
      ?.filter((p) => p.photoType === "gallery" && p.themeId === themeId)
      .sort((a, b) => a.displayOrder - b.displayOrder) || [];

  return (
    <LisasTheme
      fieldNameA={weddingData.fieldNameA}
      fieldNameB={weddingData.fieldNameB}
      fieldLocationName={weddingData.fieldLocationName}
      fieldLocationAddress={weddingData.fieldLocationAddress}
      fieldEventDate={weddingData.fieldEventDate}
      fieldEventTime={weddingData.fieldEventTime}
      fieldMapsShareUrl={weddingData.fieldMapsShareUrl}
      heroImageUrl={heroPhoto?.blobUrl}
      ourStoryImageUrl={storyPhoto?.blobUrl}
      galleryImages={
        galleryPhotos.length > 0
          ? galleryPhotos.map((p) => p.blobUrl)
          : undefined
      }
      websiteSections={weddingData.websiteSections}
    />
  );
}

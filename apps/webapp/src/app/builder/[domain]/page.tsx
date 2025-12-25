"use client";

import { WebsiteBuilderPreview } from "component-shelf";
import { useWeddingData } from "@/contexts/WeddingDataContext";

export default function BuilderPreviewPage() {
  const weddingData = useWeddingData();

  const builderData = {
    fieldNameA: weddingData.fieldNameA,
    fieldNameB: weddingData.fieldNameB,
    fieldLocationName: weddingData.fieldLocationName,
    fieldLocationAddress: weddingData.fieldLocationAddress,
    fieldEventDate: weddingData.fieldEventDate,
    fieldEventTime: weddingData.fieldEventTime,
    fieldMapsShareUrl: weddingData.fieldMapsShareUrl,
    photos: weddingData.photos,
    websiteSections: weddingData.websiteSections,
    websiteLabels: weddingData.websiteLabels,
    subdomain: weddingData.subdomain,
    customDomain: weddingData.customDomain,
  };

  return <WebsiteBuilderPreview data={builderData} />;
}

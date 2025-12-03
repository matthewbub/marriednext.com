"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationWebsiteBuilder,
  WebsiteBuilderData,
  DashboardUserData,
  DashboardWeddingData,
} from "component-shelf";

const websiteBuilderSchema = z.object({
  displayName: z.string(),
  locationName: z.string(),
  locationAddress: z.string(),
  eventDate: z.string().nullable(),
  eventTime: z.string(),
  mapsShareUrl: z.string(),
  nameA: z.string(),
  nameB: z.string(),
  subdomain: z.string(),
  customDomain: z.string().nullable(),
  photos: z.array(
    z.object({
      id: z.string(),
      themeId: z.string(),
      photoType: z.enum(["hero", "story", "gallery", "memory"]),
      blobUrl: z.string(),
      displayOrder: z.number(),
    })
  ).optional(),
  user: z.object({
    fullName: z.string(),
    imageUrl: z.string().nullable(),
    initials: z.string(),
    email: z.string(),
  }),
  subscriptionPlan: z.string(),
});

type WebsiteBuilderResponse = z.infer<typeof websiteBuilderSchema>;

async function fetchWebsiteBuilder(): Promise<WebsiteBuilderResponse> {
  const res = await fetch("/api/website-builder");
  if (!res.ok) {
    throw new Error("Failed to fetch website builder data");
  }
  const data = await res.json();
  return websiteBuilderSchema.parse(data);
}

function transformToBuilderData(
  response: WebsiteBuilderResponse
): WebsiteBuilderData {
  return {
    fieldNameA: response.nameA || null,
    fieldNameB: response.nameB || null,
    fieldLocationName: response.locationName || null,
    fieldLocationAddress: response.locationAddress || null,
    fieldEventDate: response.eventDate || null,
    fieldEventTime: response.eventTime || null,
    fieldMapsShareUrl: response.mapsShareUrl || null,
    photos: response.photos,
    subdomain: response.subdomain || null,
    customDomain: response.customDomain || null,
    subscriptionPlan: response.subscriptionPlan,
  };
}

function transformToUserData(
  response: WebsiteBuilderResponse
): DashboardUserData {
  return {
    fullName: response.user.fullName,
    email: response.user.email,
    imageUrl: response.user.imageUrl,
    initials: response.user.initials,
    subscriptionPlan: response.subscriptionPlan,
  };
}

function transformToWeddingData(
  response: WebsiteBuilderResponse
): DashboardWeddingData {
  return {
    displayName: response.displayName,
    nameA: response.nameA,
    nameB: response.nameB,
    eventDate: response.eventDate,
  };
}

export default function WebsitePage() {
  const pathname = usePathname();
  const { data, isLoading } = useQuery({
    queryKey: ["website-builder"],
    queryFn: fetchWebsiteBuilder,
  });

  const builderData = data ? transformToBuilderData(data) : undefined;
  const userData = data ? transformToUserData(data) : undefined;
  const weddingData = data ? transformToWeddingData(data) : undefined;

  return (
    <ApplicationDashboardLayout
      user={userData}
      wedding={weddingData}
      Link={Link}
      pathname={pathname}
    >
      <ApplicationWebsiteBuilder data={builderData} isLoading={isLoading} />
    </ApplicationDashboardLayout>
  );
}

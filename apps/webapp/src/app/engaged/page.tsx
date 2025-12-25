"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationDashboardOverview,
  HomeStatsData,
  DashboardUserData,
  DashboardWeddingData,
} from "component-shelf";

const homeStatsSchema = z.object({
  totalGuests: z.number(),
  totalInvitations: z.number(),
  respondedGuests: z.number(),
  responseRate: z.number(),
  attendingGuests: z.number(),
  declinedGuests: z.number(),
  pendingGuests: z.number(),
  weddingDate: z.string().nullable(),
  weddingLocation: z.string().nullable(),
  coupleNames: z.object({
    nameA: z.string(),
    nameB: z.string(),
    displayName: z.string(),
  }),
  subscriptionPlan: z.string(),
  siteUrl: z.string(),
  user: z.object({
    fullName: z.string(),
    imageUrl: z.string().nullable(),
    initials: z.string(),
    email: z.string(),
  }),
  websiteTemplate: z.string(),
  subdomain: z.string().nullable(),
  customDomain: z.string().nullable(),
});

type HomeStatsResponse = z.infer<typeof homeStatsSchema>;

async function fetchHomeStats(): Promise<HomeStatsResponse> {
  const res = await fetch("/api/v2/engaged/home-stats");
  if (!res.ok) {
    throw new Error("Failed to fetch home stats");
  }
  const data = await res.json();
  return data;
}

function transformToOverviewData(response: HomeStatsResponse): HomeStatsData {
  return {
    totalGuests: response.totalGuests,
    totalInvitations: response.totalInvitations,
    respondedGuests: response.respondedGuests,
    responseRate: response.responseRate,
    attendingGuests: response.attendingGuests,
    declinedGuests: response.declinedGuests,
    pendingGuests: response.pendingGuests,
    weddingDate: response.weddingDate,
    weddingLocation: response.weddingLocation,
    coupleNames: response.coupleNames,
    subscriptionPlan: response.subscriptionPlan,
    siteUrl: response.siteUrl,
    subdomain: response.subdomain,
    customDomain: response.customDomain,
    websiteTemplate: response.websiteTemplate,
  };
}

function transformToUserData(response: HomeStatsResponse): DashboardUserData {
  return {
    fullName: response.user.fullName,
    email: response.user.email,
    imageUrl: response.user.imageUrl,
    initials: response.user.initials,
    subscriptionPlan: response.subscriptionPlan,
  };
}

function transformToWeddingData(
  response: HomeStatsResponse
): DashboardWeddingData {
  return {
    displayName: response.coupleNames.displayName,
    nameA: response.coupleNames.nameA,
    nameB: response.coupleNames.nameB,
    eventDate: response.weddingDate,
  };
}

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { data, isLoading } = useQuery({
    queryKey: ["home-stats"],
    queryFn: fetchHomeStats,
  });
  const overviewData = data ? transformToOverviewData(data) : undefined;
  const userData = data ? transformToUserData(data) : undefined;
  const weddingData = data ? transformToWeddingData(data) : undefined;

  return (
    <ApplicationDashboardLayout
      user={userData}
      wedding={weddingData}
      Link={Link}
      pathname={pathname}
      onLogout={() => signOut({ redirectUrl: "/" })}
      onInviteClick={() => router.push("/engaged/permissions")}
    >
      <ApplicationDashboardOverview data={overviewData} isLoading={isLoading} />
    </ApplicationDashboardLayout>
  );
}

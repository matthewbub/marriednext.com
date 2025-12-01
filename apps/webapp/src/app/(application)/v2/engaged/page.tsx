"use client";

import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationDashboardOverview,
  HomeStatsData,
} from "component-shelf";

const homeStatsSchema = z.object({
  totalGuests: z.number(),
  respondedGuests: z.number(),
  responseRate: z.number(),
  attendingGuests: z.number(),
  declinedGuests: z.number(),
  pendingGuests: z.number(),
  weddingDate: z.string().nullable(),
  coupleNames: z.object({
    nameA: z.string(),
    nameB: z.string(),
    displayName: z.string(),
  }),
  subscriptionPlan: z.string(),
  siteUrl: z.string(),
});

async function fetchHomeStats(): Promise<HomeStatsData> {
  const res = await fetch("/api/v2/engaged/home-stats");
  if (!res.ok) {
    throw new Error("Failed to fetch home stats");
  }
  const data = await res.json();
  return homeStatsSchema.parse(data);
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-stats"],
    queryFn: fetchHomeStats,
  });

  return (
    <ApplicationDashboardLayout>
      <ApplicationDashboardOverview data={data} isLoading={isLoading} />
    </ApplicationDashboardLayout>
  );
}

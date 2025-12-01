"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Countdown from "@/components/tenant/Countdown";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EngagedShell } from "component-shelf";
import { UserButton } from "@clerk/nextjs";

const settingsSchema = z.object({
  displayName: z.string(),
  locationName: z.string(),
  locationAddress: z.string(),
  eventDate: z.string().nullable(),
  eventTime: z.string(),
  mapsEmbedUrl: z.string(),
  mapsShareUrl: z.string(),
  questionsAndAnswers: z.array(
    z.object({ id: z.string(), question: z.string(), answer: z.string() })
  ),
  ourStory: z.array(
    z.object({
      id: z.string(),
      heading: z.string(),
      text: z.string(),
      photoUrl: z.string(),
    })
  ),
  subdomain: z.string(),
  domain: z.string(),
  nameA: z.string(),
  nameB: z.string(),
});

async function fetchSettings() {
  const res = await fetch("/api/settings");
  if (!res.ok) {
    throw new Error("Failed to load wedding settings");
  }
  const data = await res.json();
  return settingsSchema.parse(data);
}

export default function Home() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    retry: 1,
  });

  const countdownIso = useMemo(() => {
    if (!data?.eventDate) return null;
    try {
      const d = new Date(data.eventDate);
      return d.toISOString();
    } catch {
      return null;
    }
  }, [data?.eventDate]);

  if (isLoading) {
    return <LoadingSpinner message="Loading your home..." />;
  }

  if (isError || !data) {
    return (
      <EngagedShell userButton={<UserButton />}>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="text-center py-12 space-y-4">
            <div className="text-lg font-medium">
              We couldn't load your wedding
            </div>
            <div className="text-gray-600">Try again in a moment</div>
            <button
              onClick={() => refetch()}
              className="border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </EngagedShell>
    );
  }

  const siteLabel = data.domain || data.subdomain;
  const canOpenMap = Boolean(data.mapsShareUrl);

  return (
    <EngagedShell userButton={<UserButton />}>
      <div className="pt-8 pb-24 mx-auto">
        <div className="flex flex-col items-start gap-2 mb-10">
          <div
            className={cn("text-sm tracking-widest uppercase text-gray-600")}
          >
            Engaged Home
          </div>
          <h1
            className={cn("mn-primary-font text-4xl md:text-5xl font-semibold")}
          >
            {data.displayName || `${data.nameA} & ${data.nameB}`}
          </h1>
          <div className={cn("text-base md:text-lg text-gray-700")}>
            {data.locationName
              ? `${data.locationName}${
                  data.locationAddress ? " • " + data.locationAddress : ""
                }`
              : data.locationAddress}
          </div>
          <div className={cn("text-base md:text-lg text-gray-700")}>
            {data.eventDate
              ? new Date(data.eventDate).toLocaleDateString()
              : "Set your date"}
            {data.eventTime ? " • " + data.eventTime : ""}
          </div>
        </div>

        {countdownIso && (
          <Card className="mb-10">
            <CardHeader>
              <CardTitle>Countdown to your day</CardTitle>
            </CardHeader>
            <CardContent>
              <Countdown
                targetUtcIso={countdownIso}
                labels={{
                  days: "Days",
                  hours: "Hours",
                  minutes: "Minutes",
                  seconds: "Seconds",
                }}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>When & where</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-xl font-medium">
                  {data.eventDate
                    ? new Date(data.eventDate).toLocaleDateString()
                    : "Add your date"}
                </div>
                <div className="text-gray-700">
                  {data.eventTime || "Add your time"}
                </div>
                <div className="text-gray-900">
                  {data.locationName || "Add a location"}
                </div>
                <div className="text-gray-700">
                  {data.locationAddress || "Add an address"}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                {canOpenMap && (
                  <a
                    href={data.mapsShareUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex"
                  >
                    <Button>Open map</Button>
                  </a>
                )}
                <Link href="/engaged/settings">
                  <Button variant="secondary">Edit details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share your site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {siteLabel || "Choose your URL"}
              </div>
              <div className="text-gray-700 mt-1">
                Copy and share with guests when you're ready
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={() => navigator.clipboard.writeText(siteLabel)}
                  disabled={!siteLabel}
                >
                  Copy
                </Button>
                <Link href="/engaged/settings">
                  <Button variant="secondary">Domain settings</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tell your story</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">
                Invite your guests into the vibe of your day
              </div>
              <div className="flex gap-3 mt-6">
                <Link href="/engaged/settings">
                  <Button>Write your story</Button>
                </Link>
                <Link href="/engaged/settings">
                  <Button variant="secondary">Add Q&A</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guests & invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">
                Bring your people in and make it easy to RSVP
              </div>
              <div className="flex gap-3 mt-6">
                <Link href="/engaged/guest-list">
                  <Button>Add guests</Button>
                </Link>
                <Link href="/engaged/guest-list">
                  <Button variant="secondary">Manage invitations</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </EngagedShell>
  );
}

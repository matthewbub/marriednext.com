"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ShellForm from "@/components/admin/ShellForm";
import OurStoryForm from "@/components/admin/OurStoryForm";
import QAForm from "@/components/admin/QAForm";

interface StoryItem {
  id: string;
  heading: string;
  text: string;
  photoUrl: string;
}

interface QAItem {
  id: string;
  question: string;
  answer: string;
}

interface SettingsData {
  displayName: string;
  locationName: string;
  locationAddress: string;
  eventDate: string | null;
  eventTime: string;
  mapsEmbedUrl: string;
  mapsShareUrl: string;
  questionsAndAnswers: QAItem[];
  ourStory: StoryItem[];
}

async function fetchSettings(): Promise<SettingsData> {
  const response = await fetch("/api/settings");
  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
}

async function updateSettings(data: Partial<SettingsData>): Promise<void> {
  const response = await fetch("/api/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update settings");
  }
}

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-12">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="border-b border-gray-300 pb-6 mb-12">
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-lg text-gray-700">
          Manage your wedding website settings
        </p>
      </div>

      <div className="space-y-16">
        <ShellForm
          defaultValues={{
            displayName: settings?.displayName || "",
            locationName: settings?.locationName || "",
            locationAddress: settings?.locationAddress || "",
            eventDate: settings?.eventDate
              ? new Date(settings.eventDate)
              : undefined,
            eventTime: settings?.eventTime || "",
            mapsEmbedUrl: settings?.mapsEmbedUrl || "",
            mapsShareUrl: settings?.mapsShareUrl || "",
          }}
          onSubmitBasicInfo={(data) => {
            mutation.mutate({
              displayName: data.displayName,
              locationName: data.locationName,
              locationAddress: data.locationAddress,
            });
          }}
          onSubmitDateTime={(data) => {
            mutation.mutate({
              eventDate: data.eventDate?.toISOString() || null,
              eventTime: data.eventTime,
            });
          }}
          onSubmitMaps={(data) => {
            mutation.mutate({
              mapsEmbedUrl: data.mapsEmbedUrl,
              mapsShareUrl: data.mapsShareUrl,
            });
          }}
        />
        <OurStoryForm
          defaultStories={settings?.ourStory || []}
          onSubmit={(stories) => {
            mutation.mutate({ ourStory: stories });
          }}
        />
        <QAForm
          defaultQAItems={settings?.questionsAndAnswers || []}
          onSubmit={(qaItems) => {
            mutation.mutate({ questionsAndAnswers: qaItems });
          }}
        />
      </div>
    </div>
  );
}

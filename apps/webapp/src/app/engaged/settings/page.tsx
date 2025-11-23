"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ShellForm from "@/components/admin/ShellForm";
import OurStoryForm from "@/components/admin/OurStoryForm";
import QAForm from "@/components/admin/QAForm";
import DomainForm from "@/components/admin/DomainForm";
import NamesForm from "@/components/admin/NamesForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

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
  subdomain: string;
  domain: string;
  nameA: string;
  nameB: string;
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

  const {
    data: settings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "Failed to save settings";
      toast.error(message);
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  if (isError) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="text-center py-12 space-y-4">
          <div className="text-red-600 text-lg font-medium">
            Error loading settings
          </div>
          <div className="text-gray-600">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </div>
          <button
            onClick={() => refetch()}
            className="inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors text-base"
          >
            Retry
          </button>
        </div>
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
        <DomainForm
          defaultValues={{
            subdomain: settings?.subdomain || "",
            domain: settings?.domain || "",
          }}
          onSubmit={(data) => {
            mutation.mutate({
              subdomain: data.subdomain,
              domain: data.domain,
            });
          }}
        />
        <NamesForm
          defaultValues={{
            nameA: settings?.nameA || "",
            nameB: settings?.nameB || "",
          }}
          onSubmit={(data) => {
            mutation.mutate({
              nameA: data.nameA,
              nameB: data.nameB,
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

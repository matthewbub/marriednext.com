"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import { z } from "zod";
import {
  ApplicationDashboardLayout,
  ApplicationWeddingDetailsSettings,
  DashboardUserData,
  DashboardWeddingData,
  WeddingDetailsData,
  DomainSettings,
} from "component-shelf";

const weddingDetailsSchema = z.object({
  displayName: z.string(),
  nameA: z.string(),
  nameB: z.string(),
  eventDate: z.string(),
  eventTime: z.string(),
  locationName: z.string(),
  locationAddress: z.string(),
  mapsEmbedUrl: z.string(),
  mapsShareUrl: z.string(),
  preferredAddressLine1: z.string(),
  preferredAddressLine2: z.string(),
  preferredCity: z.string(),
  preferredState: z.string(),
  preferredZipCode: z.string(),
  preferredCountry: z.string(),
});

const domainSettingsSchema = z.object({
  subdomain: z.string(),
  customDomain: z.string().nullable(),
  hasCustomDomainUpgrade: z.boolean(),
  domainVerified: z.boolean(),
});

const settingsResponseSchema = z.object({
  user: z.object({
    fullName: z.string(),
    imageUrl: z.string().nullable(),
    initials: z.string(),
    email: z.string(),
  }),
  wedding: z.object({
    displayName: z.string(),
    nameA: z.string(),
    nameB: z.string(),
    eventDate: z.string().nullable(),
  }),
  subscriptionPlan: z.string(),
  weddingDetails: weddingDetailsSchema,
  domainSettings: domainSettingsSchema,
});

type SettingsResponse = z.infer<typeof settingsResponseSchema>;

async function fetchSettings(): Promise<SettingsResponse> {
  const res = await fetch("/api/v2/engaged/settings");
  if (!res.ok) {
    throw new Error("Failed to fetch settings");
  }
  const data = await res.json();
  return settingsResponseSchema.parse(data);
}

function transformToUserData(response: SettingsResponse): DashboardUserData {
  return {
    fullName: response.user.fullName,
    email: response.user.email,
    imageUrl: response.user.imageUrl,
    initials: response.user.initials,
    subscriptionPlan: response.subscriptionPlan,
  };
}

function transformToWeddingData(
  response: SettingsResponse
): DashboardWeddingData {
  return {
    displayName: response.wedding.displayName,
    nameA: response.wedding.nameA,
    nameB: response.wedding.nameB,
    eventDate: response.wedding.eventDate,
  };
}

function transformToWeddingDetailsData(
  response: SettingsResponse
): WeddingDetailsData {
  return {
    displayName: response.weddingDetails.displayName,
    nameA: response.weddingDetails.nameA,
    nameB: response.weddingDetails.nameB,
    eventDate: response.weddingDetails.eventDate,
    eventTime: response.weddingDetails.eventTime,
    locationName: response.weddingDetails.locationName,
    locationAddress: response.weddingDetails.locationAddress,
    mapsEmbedUrl: response.weddingDetails.mapsEmbedUrl,
    mapsShareUrl: response.weddingDetails.mapsShareUrl,
    preferredAddressLine1: response.weddingDetails.preferredAddressLine1,
    preferredAddressLine2: response.weddingDetails.preferredAddressLine2,
    preferredCity: response.weddingDetails.preferredCity,
    preferredState: response.weddingDetails.preferredState,
    preferredZipCode: response.weddingDetails.preferredZipCode,
    preferredCountry: response.weddingDetails.preferredCountry,
  };
}

function transformToDomainSettings(response: SettingsResponse): DomainSettings {
  return {
    subdomain: response.domainSettings.subdomain,
    customDomain: response.domainSettings.customDomain,
    hasCustomDomainUpgrade: response.domainSettings.hasCustomDomainUpgrade,
    domainVerified: response.domainSettings.domainVerified,
  };
}

type WeddingDetailsFormData = {
  displayName: string;
  nameA: string;
  nameB: string;
  eventDate: string;
  eventTime: string;
  locationName: string;
  locationAddress: string;
  mapsEmbedUrl?: string;
  mapsShareUrl?: string;
  preferredAddressLine1?: string;
  preferredAddressLine2?: string;
  preferredCity?: string;
  preferredState?: string;
  preferredZipCode?: string;
  preferredCountry?: string;
};

async function updateSettings(data: WeddingDetailsFormData): Promise<void> {
  const res = await fetch("/api/v2/engaged/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      displayName: data.displayName,
      nameA: data.nameA,
      nameB: data.nameB,
      eventDate: data.eventDate || null,
      eventTime: data.eventTime,
      locationName: data.locationName,
      locationAddress: data.locationAddress,
      mapsEmbedUrl: data.mapsEmbedUrl || "",
      mapsShareUrl: data.mapsShareUrl || "",
      preferredAddressLine1: data.preferredAddressLine1 || "",
      preferredAddressLine2: data.preferredAddressLine2 || "",
      preferredCity: data.preferredCity || "",
      preferredState: data.preferredState || "",
      preferredZipCode: data.preferredZipCode || "",
      preferredCountry: data.preferredCountry || "",
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update settings");
  }
}

async function updateDomainSettings(data: {
  subdomain?: string;
  customDomain?: string | null;
}): Promise<void> {
  const res = await fetch("/api/v2/engaged/domain", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update domain settings");
  }
}

export default function SettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const updateSubdomainMutation = useMutation({
    mutationFn: (subdomain: string) => updateDomainSettings({ subdomain }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const updateCustomDomainMutation = useMutation({
    mutationFn: (customDomain: string) =>
      updateDomainSettings({ customDomain }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const deleteCustomDomainMutation = useMutation({
    mutationFn: () => updateDomainSettings({ customDomain: null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  const isSavingDomain =
    updateSubdomainMutation.isPending ||
    updateCustomDomainMutation.isPending ||
    deleteCustomDomainMutation.isPending;

  const userData = data ? transformToUserData(data) : undefined;
  const weddingData = data ? transformToWeddingData(data) : undefined;
  const weddingDetails = data ? transformToWeddingDetailsData(data) : undefined;
  const domainSettings = data ? transformToDomainSettings(data) : undefined;

  if (isLoading || !data) {
    return (
      <ApplicationDashboardLayout
        user={userData}
        wedding={weddingData}
        Link={Link}
        pathname={pathname}
        onLogout={() => signOut({ redirectUrl: "/" })}
        onInviteClick={() => router.push("/v2/engaged/permissions")}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </ApplicationDashboardLayout>
    );
  }

  return (
    <ApplicationDashboardLayout
      user={userData}
      wedding={weddingData}
      Link={Link}
      pathname={pathname}
      onLogout={() => signOut({ redirectUrl: "/" })}
      onInviteClick={() => router.push("/v2/engaged/permissions")}
    >
      <ApplicationWeddingDetailsSettings
        weddingDetails={weddingDetails!}
        domainSettings={domainSettings!}
        onSave={updateSettingsMutation.mutateAsync}
        isSaving={updateSettingsMutation.isPending}
        onSaveSubdomain={updateSubdomainMutation.mutateAsync}
        onSaveCustomDomain={updateCustomDomainMutation.mutateAsync}
        onDeleteCustomDomain={deleteCustomDomainMutation.mutateAsync}
        isSavingDomain={isSavingDomain}
      />
    </ApplicationDashboardLayout>
  );
}

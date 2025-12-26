import type { HomeStatsResponse, HomeStatsData } from "types-shelf/home";
import type { ShellResponse } from "types-shelf/shell";

export function transformHomeStatsToOverviewData(
  response: HomeStatsResponse,
  shell: ShellResponse
): HomeStatsData {
  return {
    totalGuests: response.totalGuests,
    totalInvitations: response.totalInvitations,
    respondedGuests: response.respondedGuests,
    responseRate: response.responseRate,
    attendingGuests: response.attendingGuests,
    declinedGuests: response.declinedGuests,
    pendingGuests: response.pendingGuests,
    weddingDate: shell.wedding.eventDate,
    weddingLocation: response.weddingLocation,
    coupleNames: {
      nameA: shell.wedding.nameA,
      nameB: shell.wedding.nameB,
      displayName: shell.wedding.displayName,
    },
    subscriptionPlan: shell.subscriptionPlan,
    siteUrl: response.siteUrl,
    subdomain: response.subdomain,
    customDomain: response.customDomain,
    websiteTemplate: response.websiteTemplate,
  };
}


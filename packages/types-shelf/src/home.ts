export type HomeStatsData = {
  totalGuests: number;
  totalInvitations: number;
  respondedGuests: number;
  responseRate: number;
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  weddingDate: string | null;
  weddingLocation: string | null;
  coupleNames: {
    nameA: string;
    nameB: string;
    displayName: string;
  };
  subscriptionPlan: string;
  siteUrl: string;
  subdomain: string | null;
  customDomain: string | null;
  websiteTemplate: string;
};

export type HomeStatsResponse = {
  totalGuests: number;
  totalInvitations: number;
  respondedGuests: number;
  responseRate: number;
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  weddingLocation: string | null;
  siteUrl: string;
  subdomain: string | null;
  customDomain: string | null;
  websiteTemplate: string;
};

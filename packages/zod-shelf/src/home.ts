import { z } from "zod";
import type { HomeStatsResponse } from "types-shelf/home";

export const homeStatsResponseSchema = z.object({
  totalGuests: z.number(),
  totalInvitations: z.number(),
  respondedGuests: z.number(),
  responseRate: z.number(),
  attendingGuests: z.number(),
  declinedGuests: z.number(),
  pendingGuests: z.number(),
  weddingLocation: z.string().nullable(),
  siteUrl: z.string(),
  subdomain: z.string().nullable(),
  customDomain: z.string().nullable(),
  websiteTemplate: z.string(),
}) satisfies z.ZodType<HomeStatsResponse>;


import { db } from "@/database/drizzle";
import { redis } from "@/database/redis";
import { wedding } from "orm-shelf/schema";
import { eq, or } from "drizzle-orm";
import type { WeddingData } from "@/lib/tenant/weddingData.types";
import { WEDDING_CACHE_TTL } from "@/lib/cache/constants";

async function getWeddingFromDatabase(
  domain: string
): Promise<WeddingData | null> {
  const [result] = await db
    .select({
      id: wedding.id,
      subdomain: wedding.subdomain,
      customDomain: wedding.customDomain,
      createdAt: wedding.createdAt,
      updatedAt: wedding.updatedAt,
      fieldDisplayName: wedding.fieldDisplayName,
      fieldLocationName: wedding.fieldLocationName,
      fieldLocationAddress: wedding.fieldLocationAddress,
      fieldEventDate: wedding.fieldEventDate,
      fieldEventTime: wedding.fieldEventTime,
      fieldMapsEmbedUrl: wedding.fieldMapsEmbedUrl,
      fieldMapsShareUrl: wedding.fieldMapsShareUrl,
      fieldQuestionsAndAnswers: wedding.fieldQuestionsAndAnswers,
      fieldOurStory: wedding.fieldOurStory,
      fieldNameA: wedding.fieldNameA,
      fieldNameB: wedding.fieldNameB,
      controlRsvpNameFormat: wedding.controlRsvpNameFormat,
    })
    .from(wedding)
    .where(or(eq(wedding.subdomain, domain), eq(wedding.customDomain, domain)))
    .limit(1);

  return result || null;
}

export async function getWeddingByDomain(
  domain: string
): Promise<WeddingData | null> {
  const cacheKey = `wedding:domain:${domain}`;

  const cached = await redis.get<WeddingData>(cacheKey);
  if (cached) {
    return cached;
  }

  const weddingData = await getWeddingFromDatabase(domain);

  if (weddingData) {
    await redis.set(cacheKey, weddingData, { ex: WEDDING_CACHE_TTL });
  }

  return weddingData;
}

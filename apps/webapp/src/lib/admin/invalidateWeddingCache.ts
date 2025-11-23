import { redis } from "@/database/redis";
import type { WeddingData } from "@/lib/tenant/weddingData.types";
import { WEDDING_CACHE_TTL } from "@/lib/cache/constants";

export async function invalidateWeddingCache(weddingData: {
  subdomain: string | null;
  customDomain: string | null;
}) {
  const cacheKeys: string[] = [];

  if (weddingData.subdomain) {
    cacheKeys.push(`wedding:domain:${weddingData.subdomain}`);
  }

  if (weddingData.customDomain) {
    cacheKeys.push(`wedding:domain:${weddingData.customDomain}`);
  }

  if (cacheKeys.length > 0) {
    await Promise.all(cacheKeys.map((key) => redis.del(key)));
  }
}

export async function updateWeddingCache(weddingData: WeddingData) {
  const updates: Promise<unknown>[] = [];

  if (weddingData.subdomain) {
    updates.push(
      redis.set(`wedding:domain:${weddingData.subdomain}`, weddingData, {
        ex: WEDDING_CACHE_TTL,
      })
    );
  }

  if (weddingData.customDomain) {
    updates.push(
      redis.set(`wedding:domain:${weddingData.customDomain}`, weddingData, {
        ex: WEDDING_CACHE_TTL,
      })
    );
  }

  if (updates.length > 0) {
    await Promise.all(updates);
  }
}

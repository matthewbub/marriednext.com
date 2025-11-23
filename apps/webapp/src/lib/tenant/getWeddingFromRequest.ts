import { db } from "@/database/drizzle";
import { wedding } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";
import { getHostType } from "../rewrites/multitenancy";

export async function getWeddingFromRequest(request: Request): Promise<{
  id: string;
  controlRsvpNameFormat: "FIRST_NAME_ONLY" | "FULL_NAME";
} | null> {
  const hostHeader = request.headers.get("host") || "";
  const { isTenantHost, firstLabel } = getHostType(hostHeader);

  if (isTenantHost) {
    const subdomain = firstLabel;
    const [weddingData] = await db
      .select({
        id: wedding.id,
        controlRsvpNameFormat: wedding.controlRsvpNameFormat,
      })
      .from(wedding)
      .where(
        or(
          eq(wedding.subdomain, subdomain),
          eq(wedding.customDomain, hostHeader)
        )
      )
      .limit(1);

    return weddingData || null;
  }

  return null;
}

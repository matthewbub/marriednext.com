import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding, weddingUsers } from "orm-shelf/schema";
import { eq } from "drizzle-orm";

export async function getHomeStatsWedding() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [result] = await db
    .select({
      id: wedding.id,
      subdomain: wedding.subdomain,
      customDomain: wedding.customDomain,
      fieldLocationName: wedding.fieldLocationName,
      websiteTemplate: wedding.websiteTemplate,
    })
    .from(weddingUsers)
    .innerJoin(wedding, eq(weddingUsers.weddingId, wedding.id))
    .where(eq(weddingUsers.clerkUserId, userId))
    .limit(1);

  return result || null;
}


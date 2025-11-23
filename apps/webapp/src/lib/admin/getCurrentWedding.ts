import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding, weddingUsers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCurrentWedding() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

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
    .from(weddingUsers)
    .innerJoin(wedding, eq(weddingUsers.weddingId, wedding.id))
    .where(eq(weddingUsers.clerkUserId, userId))
    .limit(1);

  return result || null;
}

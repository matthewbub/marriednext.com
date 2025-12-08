import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding, weddingUsers } from "orm-shelf/schema";
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
      websiteTemplate: wedding.websiteTemplate,
      fieldPreferredLocationAddressLine1:
        wedding.fieldPreferredLocationAddressLine1,
      fieldPreferredLocationAddressLine2:
        wedding.fieldPreferredLocationAddressLine2,
      fieldPreferredLocationCity: wedding.fieldPreferredLocationCity,
      fieldPreferredLocationState: wedding.fieldPreferredLocationState,
      fieldPreferredLocationZipCode: wedding.fieldPreferredLocationZipCode,
      fieldPreferredLocationCountry: wedding.fieldPreferredLocationCountry,
      websiteSections: wedding.websiteSections,
      websiteLabels: wedding.websiteLabels,
    })
    .from(weddingUsers)
    .innerJoin(wedding, eq(weddingUsers.weddingId, wedding.id))
    .where(eq(weddingUsers.clerkUserId, userId))
    .limit(1);

  console.log("result wedding id", result?.id);
  return result || null;
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding, weddingUsers } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { updateWeddingCache } from "@/lib/admin/invalidateWeddingCache";

const SUBDOMAIN_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const onboardingSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be at most 63 characters")
    .regex(
      SUBDOMAIN_REGEX,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  partner1Name: z.string().min(1, "Partner 1 name is required"),
  partner2Name: z.string().min(1, "Partner 2 name is required"),
  weddingDate: z.string().min(1, "Wedding date is required"),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = onboardingSchema.parse(body);
    const { subdomain, partner1Name, partner2Name, weddingDate } =
      validatedData;

    const [existingByUserId, existingBySubdomain] = await Promise.all([
      db
        .select({ id: weddingUsers.id })
        .from(weddingUsers)
        .where(eq(weddingUsers.clerkUserId, userId))
        .limit(1),
      db
        .select({ id: wedding.id })
        .from(wedding)
        .where(eq(wedding.subdomain, subdomain))
        .limit(1),
    ]);

    if (existingByUserId[0]) {
      return NextResponse.json(
        { error: "You already have a wedding site", success: false },
        { status: 409 }
      );
    }

    if (existingBySubdomain[0]) {
      return NextResponse.json(
        { error: "This subdomain is already taken", success: false },
        { status: 409 }
      );
    }

    const displayName = `${partner1Name} & ${partner2Name}`;
    const [newWedding] = await db
      .insert(wedding)
      .values({
        subdomain,
        fieldDisplayName: displayName,
        fieldEventDate: weddingDate,
      })
      .returning();

    void (await db.insert(weddingUsers).values({
      weddingId: newWedding.id,
      clerkUserId: userId,
    }));

    await updateWeddingCache({
      id: newWedding.id,
      subdomain: newWedding.subdomain,
      customDomain: newWedding.customDomain,
      createdAt: newWedding.createdAt,
      updatedAt: newWedding.updatedAt,
      fieldDisplayName: newWedding.fieldDisplayName,
      fieldLocationName: newWedding.fieldLocationName,
      fieldLocationAddress: newWedding.fieldLocationAddress,
      fieldEventDate: newWedding.fieldEventDate,
      fieldEventTime: newWedding.fieldEventTime,
      fieldMapsEmbedUrl: newWedding.fieldMapsEmbedUrl,
      fieldMapsShareUrl: newWedding.fieldMapsShareUrl,
      fieldQuestionsAndAnswers: newWedding.fieldQuestionsAndAnswers,
      fieldOurStory: newWedding.fieldOurStory,
      fieldNameA: newWedding.fieldNameA,
      fieldNameB: newWedding.fieldNameB,
      controlRsvpNameFormat: newWedding.controlRsvpNameFormat,
    });

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        onboardingComplete: true,
        weddingId: newWedding.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        wedding: {
          id: newWedding.id,
          subdomain: newWedding.subdomain,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

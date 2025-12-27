import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding, weddingUsers } from "orm-shelf/schema";
import { eq } from "drizzle-orm";
import { updateWeddingCache } from "@/lib/wedding/cache";
import { subdomainSchema } from "@/lib/utils/site";
import { Role } from "component-shelf";
import * as Sentry from "@sentry/nextjs";

const onboardingSchema = z.object({
  fieldNameA: z.string().min(1, "Partner 1 name is required"),
  fieldNameB: z.string().min(1, "Partner 2 name is required"),
  subdomain: subdomainSchema,
  fieldEventDate: z.string().optional(),
  fieldEventTime: z.string().optional(),
  fieldLocationName: z.string().optional(),
  fieldPreferredLocationAddressLine1: z.string().optional(),
  fieldPreferredLocationAddressLine2: z.string().optional(),
  fieldPreferredLocationCity: z.string().optional(),
  fieldPreferredLocationState: z.string().optional(),
  fieldPreferredLocationZipCode: z.string().optional(),
  fieldPreferredLocationCountry: z.string().optional(),
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
    const {
      fieldNameA,
      fieldNameB,
      subdomain,
      fieldEventDate,
      fieldEventTime,
      fieldLocationName,
      fieldPreferredLocationAddressLine1,
      fieldPreferredLocationAddressLine2,
      fieldPreferredLocationCity,
      fieldPreferredLocationState,
      fieldPreferredLocationZipCode,
      fieldPreferredLocationCountry,
    } = validatedData;

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

    const [newWedding] = await db
      .insert(wedding)
      .values({
        subdomain,
        fieldDisplayName: `${fieldNameA} & ${fieldNameB}`,
        fieldNameA,
        fieldNameB,
        createdByClerkUserId: userId,
        ...(fieldEventDate && { fieldEventDate }),
        ...(fieldEventTime && { fieldEventTime }),
        ...(fieldLocationName && { fieldLocationName }),
        ...(fieldPreferredLocationAddressLine1 && {
          fieldPreferredLocationAddressLine1,
        }),
        ...(fieldPreferredLocationAddressLine2 && {
          fieldPreferredLocationAddressLine2,
        }),
        ...(fieldPreferredLocationCity && { fieldPreferredLocationCity }),
        ...(fieldPreferredLocationState && { fieldPreferredLocationState }),
        ...(fieldPreferredLocationZipCode && { fieldPreferredLocationZipCode }),
        ...(fieldPreferredLocationCountry && { fieldPreferredLocationCountry }),
      })
      .returning();

    Sentry.captureMessage("New wedding created", {
      extra: {
        weddingId: newWedding.id,
        userId,
        fieldNameA,
        fieldNameB,
      },
    });

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
    const metadataToSet = {
      onboardingComplete: true,
      weddingId: newWedding.id,
      role: "spouse" as Role,
    };

    Sentry.addBreadcrumb({
      category: "onboarding",
      message: "About to update Clerk publicMetadata",
      level: "info",
      data: { userId, metadataToSet },
    });

    const updatedUser = await client.users.updateUserMetadata(userId, {
      publicMetadata: metadataToSet,
    });

    Sentry.addBreadcrumb({
      category: "onboarding",
      message: "Clerk publicMetadata updated successfully",
      level: "info",
      data: { userId, newMetadata: updatedUser.publicMetadata },
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
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}

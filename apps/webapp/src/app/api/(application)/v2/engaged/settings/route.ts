import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding } from "orm-shelf/schema";
import { eq } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/wedding/getCurrentWedding";
import { updateWeddingCache } from "@/lib/wedding/cache";
import { getInitials } from "@/lib/utils/site";

const weddingSettingsSchema = z
  .object({
    displayName: z.string().optional(),
    nameA: z.string().optional(),
    nameB: z.string().optional(),
    eventDate: z.string().optional(),
    eventTime: z.string().optional(),
    locationName: z.string().optional(),
    locationAddress: z.string().optional(),
    mapsEmbedUrl: z.string().optional(),
    mapsShareUrl: z.string().optional(),
    preferredAddressLine1: z.string().optional(),
    preferredAddressLine2: z.string().optional(),
    preferredCity: z.string().optional(),
    preferredState: z.string().optional(),
    preferredZipCode: z.string().optional(),
    preferredCountry: z.string().optional(),
  })
  .strict();

export async function GET() {
  try {
    const [user, weddingData] = await Promise.all([
      currentUser(),
      getCurrentWedding(),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!weddingData) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const subscriptionPlan = "Free";
    const hasCustomDomainUpgrade = !!weddingData.customDomain;
    const domainVerified = !!weddingData.customDomain;

    return NextResponse.json({
      user: {
        fullName:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "User",
        imageUrl: user.imageUrl || null,
        initials: getInitials(user.fullName, user.firstName, user.lastName),
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      wedding: {
        displayName: weddingData.fieldDisplayName || "",
        nameA: weddingData.fieldNameA || "",
        nameB: weddingData.fieldNameB || "",
        eventDate: weddingData.fieldEventDate || null,
      },
      subscriptionPlan,
      weddingDetails: {
        displayName: weddingData.fieldDisplayName || "",
        nameA: weddingData.fieldNameA || "",
        nameB: weddingData.fieldNameB || "",
        eventDate: weddingData.fieldEventDate
          ? new Date(weddingData.fieldEventDate).toISOString().split("T")[0]
          : "",
        eventTime: weddingData.fieldEventTime || "",
        locationName: weddingData.fieldLocationName || "",
        locationAddress: weddingData.fieldLocationAddress || "",
        mapsEmbedUrl: weddingData.fieldMapsEmbedUrl || "",
        mapsShareUrl: weddingData.fieldMapsShareUrl || "",
        preferredAddressLine1:
          weddingData.fieldPreferredLocationAddressLine1 || "",
        preferredAddressLine2:
          weddingData.fieldPreferredLocationAddressLine2 || "",
        preferredCity: weddingData.fieldPreferredLocationCity || "",
        preferredState: weddingData.fieldPreferredLocationState || "",
        preferredZipCode: weddingData.fieldPreferredLocationZipCode || "",
        preferredCountry: weddingData.fieldPreferredLocationCountry || "",
      },
      domainSettings: {
        subdomain: weddingData.subdomain || "",
        customDomain: weddingData.customDomain || null,
        hasCustomDomainUpgrade,
        domainVerified,
      },
    });
  } catch (error) {
    console.error("Error fetching wedding settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch wedding settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const [user, currentWedding] = await Promise.all([
      currentUser(),
      getCurrentWedding(),
    ]);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!currentWedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = weddingSettingsSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validatedData.displayName !== undefined) {
      updateData.fieldDisplayName = validatedData.displayName;
    }
    if (validatedData.nameA !== undefined) {
      updateData.fieldNameA = validatedData.nameA;
    }
    if (validatedData.nameB !== undefined) {
      updateData.fieldNameB = validatedData.nameB;
    }
    if (validatedData.eventDate !== undefined) {
      updateData.fieldEventDate = validatedData.eventDate || null;
    }
    if (validatedData.eventTime !== undefined) {
      updateData.fieldEventTime = validatedData.eventTime;
    }
    if (validatedData.locationName !== undefined) {
      updateData.fieldLocationName = validatedData.locationName;
    }
    if (validatedData.locationAddress !== undefined) {
      updateData.fieldLocationAddress = validatedData.locationAddress;
    }
    if (validatedData.mapsEmbedUrl !== undefined) {
      updateData.fieldMapsEmbedUrl = validatedData.mapsEmbedUrl;
    }
    if (validatedData.mapsShareUrl !== undefined) {
      updateData.fieldMapsShareUrl = validatedData.mapsShareUrl;
    }
    if (validatedData.preferredAddressLine1 !== undefined) {
      updateData.fieldPreferredLocationAddressLine1 =
        validatedData.preferredAddressLine1;
    }
    if (validatedData.preferredAddressLine2 !== undefined) {
      updateData.fieldPreferredLocationAddressLine2 =
        validatedData.preferredAddressLine2;
    }
    if (validatedData.preferredCity !== undefined) {
      updateData.fieldPreferredLocationCity = validatedData.preferredCity;
    }
    if (validatedData.preferredState !== undefined) {
      updateData.fieldPreferredLocationState = validatedData.preferredState;
    }
    if (validatedData.preferredZipCode !== undefined) {
      updateData.fieldPreferredLocationZipCode = validatedData.preferredZipCode;
    }
    if (validatedData.preferredCountry !== undefined) {
      updateData.fieldPreferredLocationCountry = validatedData.preferredCountry;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date().toISOString();

    const [updatedWedding] = await db
      .update(wedding)
      .set(updateData)
      .where(eq(wedding.id, currentWedding.id))
      .returning();

    if (!updatedWedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    await updateWeddingCache({
      id: updatedWedding.id,
      subdomain: updatedWedding.subdomain,
      customDomain: updatedWedding.customDomain,
      createdAt: updatedWedding.createdAt,
      updatedAt: updatedWedding.updatedAt,
      fieldDisplayName: updatedWedding.fieldDisplayName,
      fieldLocationName: updatedWedding.fieldLocationName,
      fieldLocationAddress: updatedWedding.fieldLocationAddress,
      fieldEventDate: updatedWedding.fieldEventDate,
      fieldEventTime: updatedWedding.fieldEventTime,
      fieldMapsEmbedUrl: updatedWedding.fieldMapsEmbedUrl,
      fieldMapsShareUrl: updatedWedding.fieldMapsShareUrl,
      fieldQuestionsAndAnswers: updatedWedding.fieldQuestionsAndAnswers,
      fieldOurStory: updatedWedding.fieldOurStory,
      fieldNameA: updatedWedding.fieldNameA,
      fieldNameB: updatedWedding.fieldNameB,
      controlRsvpNameFormat: updatedWedding.controlRsvpNameFormat,
    });

    const subscriptionPlan = "Free";
    const hasCustomDomainUpgrade = !!updatedWedding.customDomain;
    const domainVerified = !!updatedWedding.customDomain;

    return NextResponse.json({
      success: true,
      user: {
        fullName:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "User",
        imageUrl: user.imageUrl || null,
        initials: getInitials(user.fullName, user.firstName, user.lastName),
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      wedding: {
        displayName: updatedWedding.fieldDisplayName || "",
        nameA: updatedWedding.fieldNameA || "",
        nameB: updatedWedding.fieldNameB || "",
        eventDate: updatedWedding.fieldEventDate || null,
      },
      subscriptionPlan,
      weddingDetails: {
        displayName: updatedWedding.fieldDisplayName || "",
        nameA: updatedWedding.fieldNameA || "",
        nameB: updatedWedding.fieldNameB || "",
        eventDate: updatedWedding.fieldEventDate
          ? new Date(updatedWedding.fieldEventDate).toISOString().split("T")[0]
          : "",
        eventTime: updatedWedding.fieldEventTime || "",
        locationName: updatedWedding.fieldLocationName || "",
        locationAddress: updatedWedding.fieldLocationAddress || "",
        mapsEmbedUrl: updatedWedding.fieldMapsEmbedUrl || "",
        mapsShareUrl: updatedWedding.fieldMapsShareUrl || "",
        preferredAddressLine1:
          updatedWedding.fieldPreferredLocationAddressLine1 || "",
        preferredAddressLine2:
          updatedWedding.fieldPreferredLocationAddressLine2 || "",
        preferredCity: updatedWedding.fieldPreferredLocationCity || "",
        preferredState: updatedWedding.fieldPreferredLocationState || "",
        preferredZipCode: updatedWedding.fieldPreferredLocationZipCode || "",
        preferredCountry: updatedWedding.fieldPreferredLocationCountry || "",
      },
      domainSettings: {
        subdomain: updatedWedding.subdomain || "",
        customDomain: updatedWedding.customDomain || null,
        hasCustomDomainUpgrade,
        domainVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating wedding settings:", error);
    return NextResponse.json(
      { error: "Failed to update wedding settings" },
      { status: 500 }
    );
  }
}

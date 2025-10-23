import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { wedding } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";

const qaItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

const storyItemSchema = z.object({
  id: z.string(),
  heading: z.string(),
  text: z.string(),
  photoUrl: z.string(),
});

const weddingSettingsSchema = z
  .object({
    displayName: z.string().optional(),
    locationName: z.string().optional(),
    locationAddress: z.string().optional(),
    eventDate: z.string().nullable().optional(),
    eventTime: z.string().optional(),
    mapsEmbedUrl: z.string().optional(),
    mapsShareUrl: z.string().optional(),
    questionsAndAnswers: z.array(qaItemSchema).optional(),
    ourStory: z.array(storyItemSchema).optional(),
    subdomain: z.string().optional(),
    domain: z.string().optional(),
    nameA: z.string().optional(),
    nameB: z.string().optional(),
  })
  .strict();

export async function GET() {
  try {
    const weddingData = await getCurrentWedding();

    if (!weddingData) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    return NextResponse.json({
      displayName: weddingData.fieldDisplayName || "",
      locationName: weddingData.fieldLocationName || "",
      locationAddress: weddingData.fieldLocationAddress || "",
      eventDate: weddingData.fieldEventDate || null,
      eventTime: weddingData.fieldEventTime || "",
      mapsEmbedUrl: weddingData.fieldMapsEmbedUrl || "",
      mapsShareUrl: weddingData.fieldMapsShareUrl || "",
      questionsAndAnswers:
        (weddingData.fieldQuestionsAndAnswers as unknown[]) || [],
      ourStory: (weddingData.fieldOurStory as unknown[]) || [],
      subdomain: weddingData.subdomain || "",
      domain: weddingData.customDomain || "",
      nameA: weddingData.fieldNameA || "",
      nameB: weddingData.fieldNameB || "",
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
    const body = await req.json();
    const validatedData = weddingSettingsSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validatedData.displayName !== undefined) {
      updateData.fieldDisplayName = validatedData.displayName;
    }
    if (validatedData.locationName !== undefined) {
      updateData.fieldLocationName = validatedData.locationName;
    }
    if (validatedData.locationAddress !== undefined) {
      updateData.fieldLocationAddress = validatedData.locationAddress;
    }
    if (validatedData.eventDate !== undefined) {
      updateData.fieldEventDate = validatedData.eventDate;
    }
    if (validatedData.eventTime !== undefined) {
      updateData.fieldEventTime = validatedData.eventTime;
    }
    if (validatedData.mapsEmbedUrl !== undefined) {
      updateData.fieldMapsEmbedUrl = validatedData.mapsEmbedUrl;
    }
    if (validatedData.mapsShareUrl !== undefined) {
      updateData.fieldMapsShareUrl = validatedData.mapsShareUrl;
    }
    if (validatedData.questionsAndAnswers !== undefined) {
      updateData.fieldQuestionsAndAnswers = validatedData.questionsAndAnswers;
    }
    if (validatedData.ourStory !== undefined) {
      updateData.fieldOurStory = validatedData.ourStory;
    }
    if (validatedData.subdomain !== undefined) {
      updateData.subdomain = validatedData.subdomain;
    }
    if (validatedData.domain !== undefined) {
      updateData.customDomain = validatedData.domain;
    }
    if (validatedData.nameA !== undefined) {
      updateData.fieldNameA = validatedData.nameA;
    }
    if (validatedData.nameB !== undefined) {
      updateData.fieldNameB = validatedData.nameB;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const currentWedding = await getCurrentWedding();

    if (!currentWedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
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

    return NextResponse.json(
      {
        success: true,
        data: {
          displayName: updatedWedding.fieldDisplayName || "",
          locationName: updatedWedding.fieldLocationName || "",
          locationAddress: updatedWedding.fieldLocationAddress || "",
          eventDate: updatedWedding.fieldEventDate || null,
          eventTime: updatedWedding.fieldEventTime || "",
          mapsEmbedUrl: updatedWedding.fieldMapsEmbedUrl || "",
          mapsShareUrl: updatedWedding.fieldMapsShareUrl || "",
          questionsAndAnswers:
            (updatedWedding.fieldQuestionsAndAnswers as unknown[]) || [],
          ourStory: (updatedWedding.fieldOurStory as unknown[]) || [],
          subdomain: updatedWedding.subdomain || "",
          domain: updatedWedding.customDomain || "",
          nameA: updatedWedding.fieldNameA || "",
          nameB: updatedWedding.fieldNameB || "",
        },
      },
      { status: 200 }
    );
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

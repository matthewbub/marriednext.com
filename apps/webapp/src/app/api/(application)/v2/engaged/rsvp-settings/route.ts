import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding } from "orm-shelf/schema";
import { eq } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";
import { updateWeddingCache } from "@/lib/admin/invalidateWeddingCache";

const rsvpSettingsSchema = z
  .object({
    rsvpLookupMethod: z.enum(["FIRST_NAME_ONLY", "FULL_NAME", "EMAIL"]),
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

    return NextResponse.json({
      rsvpLookupMethod: weddingData.controlRsvpNameFormat || "FULL_NAME",
    });
  } catch (error) {
    console.error("Error fetching RSVP settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch RSVP settings" },
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
    const validatedData = rsvpSettingsSchema.parse(body);

    const [updatedWedding] = await db
      .update(wedding)
      .set({
        controlRsvpNameFormat: validatedData.rsvpLookupMethod,
        updatedAt: new Date().toISOString(),
      })
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

    return NextResponse.json({
      success: true,
      rsvpLookupMethod: updatedWedding.controlRsvpNameFormat,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating RSVP settings:", error);
    return NextResponse.json(
      { error: "Failed to update RSVP settings" },
      { status: 500 }
    );
  }
}


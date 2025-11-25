import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { wedding } from "orm-shelf/schema";
import { eq } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";
import { updateWeddingCache } from "@/lib/admin/invalidateWeddingCache";

const updateSchema = z.object({
  nameFormat: z.enum(["FIRST_NAME_ONLY", "FULL_NAME"]),
});

export async function GET() {
  try {
    const currentWedding = await getCurrentWedding();

    if (!currentWedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    return NextResponse.json({
      nameFormat: currentWedding.controlRsvpNameFormat,
    });
  } catch (error) {
    console.error("Error fetching name format setting:", error);
    return NextResponse.json(
      { error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const currentWedding = await getCurrentWedding();

    if (!currentWedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const body = await request.json();
    const parse = updateSchema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parse.error.issues },
        { status: 400 }
      );
    }

    const { nameFormat } = parse.data;

    const [updatedWedding] = await db
      .update(wedding)
      .set({
        controlRsvpNameFormat: nameFormat,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(wedding.id, currentWedding.id))
      .returning();

    if (updatedWedding) {
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
    }

    return NextResponse.json({
      success: true,
      nameFormat,
    });
  } catch (error) {
    console.error("Error updating name format setting:", error);
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

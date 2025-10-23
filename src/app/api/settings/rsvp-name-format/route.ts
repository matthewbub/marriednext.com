import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/database/drizzle";
import { wedding } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";
import * as Sentry from "@sentry/nextjs";

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
    Sentry.captureException(error, {
      tags: { route: "rsvp-name-format-get" },
    });
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

    await db
      .update(wedding)
      .set({
        controlRsvpNameFormat: nameFormat,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(wedding.id, currentWedding.id));

    Sentry.captureMessage("RSVP name format updated", {
      extra: {
        weddingId: currentWedding.id,
        newFormat: nameFormat,
      },
    });

    return NextResponse.json({
      success: true,
      nameFormat,
    });
  } catch (error) {
    console.error("Error updating name format setting:", error);
    Sentry.captureException(error, {
      tags: { route: "rsvp-name-format-put" },
    });
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding } from "orm-shelf/schema";
import { eq, and, sql } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/wedding/getCurrentWedding";
import {
  updateWeddingCache,
  invalidateWeddingCache,
} from "@/lib/wedding/cache";
import { subdomainSchema } from "@/lib/utils/site";

const domainSettingsSchema = z
  .object({
    subdomain: subdomainSchema.optional(),
    customDomain: z
      .string()
      .min(1, "Custom domain cannot be empty")
      .refine(
        (domain) =>
          !domain.startsWith("http://") && !domain.startsWith("https://"),
        "Domain should not include http:// or https://"
      )
      .refine(
        (domain) => !domain.endsWith("/"),
        "Domain should not include trailing slashes"
      )
      .optional()
      .nullable(),
  })
  .strict();

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
    const validatedData = domainSettingsSchema.parse(body);

    const updateData: Record<string, unknown> = {};

    if (validatedData.subdomain !== undefined) {
      if (validatedData.subdomain !== currentWedding.subdomain) {
        const [existingSubdomain] = await db
          .select({ id: wedding.id })
          .from(wedding)
          .where(
            and(
              eq(wedding.subdomain, validatedData.subdomain),
              sql`${wedding.id} != ${currentWedding.id}`
            )
          )
          .limit(1);

        if (existingSubdomain) {
          return NextResponse.json(
            { error: "This subdomain is already taken" },
            { status: 409 }
          );
        }
      }
      updateData.subdomain = validatedData.subdomain;
    }

    if (validatedData.customDomain !== undefined) {
      const customDomainValue =
        validatedData.customDomain === null || validatedData.customDomain === ""
          ? null
          : validatedData.customDomain.trim();

      if (
        customDomainValue &&
        customDomainValue !== currentWedding.customDomain
      ) {
        const [existingCustomDomain] = await db
          .select({ id: wedding.id })
          .from(wedding)
          .where(
            and(
              eq(wedding.customDomain, customDomainValue),
              sql`${wedding.id} != ${currentWedding.id}`
            )
          )
          .limit(1);

        if (existingCustomDomain) {
          return NextResponse.json(
            { error: "This custom domain is already in use" },
            { status: 409 }
          );
        }
      }

      updateData.customDomain = customDomainValue;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    updateData.updatedAt = new Date().toISOString();

    const oldSubdomain = currentWedding.subdomain;
    const oldCustomDomain = currentWedding.customDomain;

    const [updatedWedding] = await db
      .update(wedding)
      .set(updateData)
      .where(eq(wedding.id, currentWedding.id))
      .returning();

    if (!updatedWedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    await invalidateWeddingCache({
      subdomain: oldSubdomain,
      customDomain: oldCustomDomain,
    });

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

    const hasCustomDomainUpgrade = !!updatedWedding.customDomain;
    const domainVerified = !!updatedWedding.customDomain;

    return NextResponse.json({
      success: true,
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

    console.error("Error updating domain settings:", error);
    return NextResponse.json(
      { error: "Failed to update domain settings" },
      { status: 500 }
    );
  }
}

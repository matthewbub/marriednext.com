import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = onboardingSchema.parse(body);

    const { subdomain, partner1Name, partner2Name, weddingDate } =
      validatedData;

    const [existingByUserId] = await db
      .select({ id: wedding.id })
      .from(wedding)
      .where(eq(wedding.clerkUserId, userId))
      .limit(1);

    if (existingByUserId) {
      return NextResponse.json(
        { error: "You already have a wedding site" },
        { status: 409 }
      );
    }

    const [existingBySubdomain] = await db
      .select({ id: wedding.id })
      .from(wedding)
      .where(eq(wedding.subdomain, subdomain))
      .limit(1);

    if (existingBySubdomain) {
      return NextResponse.json(
        { error: "This subdomain is already taken" },
        { status: 409 }
      );
    }

    const displayName = `${partner1Name} & ${partner2Name}`;

    const [newWedding] = await db
      .insert(wedding)
      .values({
        clerkUserId: userId,
        subdomain,
        fieldDisplayName: displayName,
        fieldEventDate: weddingDate,
      })
      .returning();

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

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { wedding } from "orm-shelf/schema";
import { eq } from "drizzle-orm";
import { subdomainSchema } from "@/lib/utils/site";

const checkSubdomainSchema = z.object({
  subdomain: subdomainSchema,
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { available: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = checkSubdomainSchema.parse(body);
    const { subdomain } = validatedData;

    const existingBySubdomain = await db
      .select({ id: wedding.id })
      .from(wedding)
      .where(eq(wedding.subdomain, subdomain))
      .limit(1);

    if (existingBySubdomain[0]) {
      return NextResponse.json(
        { available: false, error: "This subdomain is already taken" },
        { status: 200 }
      );
    }

    return NextResponse.json({ available: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          available: false,
          error: error.issues[0]?.message ?? "Invalid subdomain",
        },
        { status: 200 }
      );
    }

    console.error("Error checking subdomain:", error);
    return NextResponse.json(
      { available: false, error: "Failed to check subdomain availability" },
      { status: 500 }
    );
  }
}

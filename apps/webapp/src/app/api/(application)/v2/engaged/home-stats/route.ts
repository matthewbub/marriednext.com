import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { guest } from "orm-shelf/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";

function buildSiteUrl(
  subdomain: string | null,
  customDomain: string | null,
  plan: string
): string {
  const subdomainUrl = subdomain ? `https://${subdomain}.marriednext.com` : "";

  if (plan === "Free") {
    return subdomainUrl;
  }

  return customDomain || subdomainUrl;
}

function getInitials(
  fullName: string | null,
  firstName: string | null,
  lastName: string | null
): string {
  if (fullName) {
    const parts = fullName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
  }
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return (first + last).toUpperCase() || "U";
}

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

    const [stats] = await db
      .select({
        totalGuests: sql<number>`count(*)::int`,
        attendingGuests: sql<number>`count(*) filter (where ${guest.isAttending} = true)::int`,
        declinedGuests: sql<number>`count(*) filter (where ${guest.isAttending} = false)::int`,
        pendingGuests: sql<number>`count(*) filter (where ${guest.isAttending} is null)::int`,
        respondedGuests: sql<number>`count(*) filter (where ${guest.isAttending} is not null)::int`,
      })
      .from(guest)
      .where(eq(guest.weddingId, weddingData.id));

    const totalGuests = stats?.totalGuests ?? 0;
    const respondedGuests = stats?.respondedGuests ?? 0;
    const responseRate =
      totalGuests > 0 ? Math.round((respondedGuests / totalGuests) * 100) : 0;

    const subscriptionPlan = "Free";
    const siteUrl = buildSiteUrl(
      weddingData.subdomain,
      weddingData.customDomain,
      subscriptionPlan
    );

    return NextResponse.json({
      totalGuests,
      respondedGuests,
      responseRate,
      attendingGuests: stats?.attendingGuests ?? 0,
      declinedGuests: stats?.declinedGuests ?? 0,
      pendingGuests: stats?.pendingGuests ?? 0,
      weddingDate: weddingData.fieldEventDate || null,
      coupleNames: {
        nameA: weddingData.fieldNameA || "",
        nameB: weddingData.fieldNameB || "",
        displayName: weddingData.fieldDisplayName || "",
      },
      subscriptionPlan,
      siteUrl,
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
    });
  } catch (error) {
    console.error("Error fetching home stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch home stats" },
      { status: 500 }
    );
  }
}

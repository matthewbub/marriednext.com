import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/database/drizzle";
import { guest, invitation } from "orm-shelf/schema";
import { eq, sql } from "drizzle-orm";
import { getCurrentWedding } from "@/lib/wedding/getCurrentWedding";
import { buildSiteUrl, getInitials } from "@/lib/utils/site";

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

    const [[guestStats], [invitationStats]] = await Promise.all([
      db
        .select({
          totalGuests: sql<number>`(count(*) + count(*) filter (where ${guest.hasPlusOne} = true))::int`,
          attendingGuests: sql<number>`count(*) filter (where ${guest.isAttending} = true)::int`,
          declinedGuests: sql<number>`count(*) filter (where ${guest.isAttending} = false)::int`,
          pendingGuests: sql<number>`(count(*) filter (where ${guest.isAttending} is null) + count(*) filter (where ${guest.hasPlusOne} = true))::int`,
          respondedGuests: sql<number>`count(*) filter (where ${guest.isAttending} is not null)::int`,
        })
        .from(guest)
        .where(eq(guest.weddingId, weddingData.id)),
      db
        .select({
          totalInvitations: sql<number>`count(*)::int`,
        })
        .from(invitation)
        .where(eq(invitation.weddingId, weddingData.id)),
    ]);

    const totalGuests = guestStats?.totalGuests ?? 0;
    const respondedGuests = guestStats?.respondedGuests ?? 0;
    const totalInvitations = invitationStats?.totalInvitations ?? 0;
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
      totalInvitations,
      respondedGuests,
      responseRate,
      attendingGuests: guestStats?.attendingGuests ?? 0,
      declinedGuests: guestStats?.declinedGuests ?? 0,
      pendingGuests: guestStats?.pendingGuests ?? 0,
      weddingDate: weddingData.fieldEventDate || null,
      weddingLocation: weddingData.fieldLocationName || null,
      coupleNames: {
        nameA: weddingData.fieldNameA || "",
        nameB: weddingData.fieldNameB || "",
        displayName: weddingData.fieldDisplayName || "",
      },
      subscriptionPlan,
      siteUrl,
      subdomain: weddingData.subdomain || null,
      customDomain: weddingData.customDomain || null,
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
      websiteTemplate: weddingData.websiteTemplate,
    });
  } catch (error) {
    console.error("Error fetching home stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch home stats" },
      { status: 500 }
    );
  }
}

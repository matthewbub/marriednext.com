import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { guest, invitation } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import {
  getGuestListData,
  type GuestListResponse,
  DatabaseError,
} from "@/lib/admin/guestListService";
import { getCurrentWedding } from "@/lib/admin/getCurrentWedding";

const getGuestListSchema = z.object({
  sortBy: z.string().default("alpha-asc"),
  limit: z.coerce.number().int().positive().max(100).default(25),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export async function GET(
  request: Request
): Promise<NextResponse<GuestListResponse | { error: string }>> {
  try {
    const wedding = await getCurrentWedding();

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const validatedParams = getGuestListSchema.parse({
      sortBy: searchParams.get("sortBy"),
      limit: searchParams.get("limit"),
      offset: searchParams.get("offset"),
    });

    const data = await getGuestListData({
      ...validatedParams,
      weddingId: wedding.id,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching guest list:", error);
    if (error instanceof z.ZodError) {
      Sentry.captureException(error, {
        level: "error",
        tags: { route: "guest-list-get" },
      });
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    if (error instanceof DatabaseError) {
      Sentry.captureException(error, {
        level: "error",
        tags: { route: "guest-list-get" },
      });
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 }
      );
    }
    Sentry.captureException(error, {
      level: "error",
      tags: { route: "guest-list-get" },
    });
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

const updateInvitationSchema = z.object({
  invitationId: z.string().uuid(),
  guestA: z.string().min(1),
  guestAAttending: z.boolean().nullable(),
  guestAHasPlusOne: z.boolean(),
  guestB: z.string().nullable(),
  guestBAttending: z.boolean().nullable(),
  guestBHasPlusOne: z.boolean(),
  guestC: z.string().nullable(),
  guestCAttending: z.boolean().nullable(),
  guestCHasPlusOne: z.boolean(),
  guestD: z.string().nullable(),
  guestDAttending: z.boolean().nullable(),
  guestDHasPlusOne: z.boolean(),
  guestE: z.string().nullable(),
  guestEAttending: z.boolean().nullable(),
  guestEHasPlusOne: z.boolean(),
  guestF: z.string().nullable(),
  guestFAttending: z.boolean().nullable(),
  guestFHasPlusOne: z.boolean(),
  guestG: z.string().nullable(),
  guestGAttending: z.boolean().nullable(),
  guestGHasPlusOne: z.boolean(),
  guestH: z.string().nullable(),
  guestHAttending: z.boolean().nullable(),
  guestHHasPlusOne: z.boolean(),
  inviteGroupName: z.string().nullable(),
});

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateInvitationSchema.parse(body);

    const existingInvitation = await db.query.invitation.findFirst({
      where: eq(invitation.id, validatedData.invitationId),
      with: {
        guest_guestA: true,
        guest_guestB: true,
        guest_guestC: true,
        guest_guestD: true,
        guest_guestE: true,
        guest_guestF: true,
        guest_guestG: true,
        guest_guestH: true,
      },
    });

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    await db.transaction(async (tx) => {
      const guestKeys = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

      for (const key of guestKeys) {
        const guestName = validatedData[
          `guest${key}` as keyof typeof validatedData
        ] as string | null;
        const guestAttending = validatedData[
          `guest${key}Attending` as keyof typeof validatedData
        ] as boolean | null;
        const guestHasPlusOne = validatedData[
          `guest${key}HasPlusOne` as keyof typeof validatedData
        ] as boolean;
        const existingGuest = existingInvitation[
          `guest_guest${key}` as keyof typeof existingInvitation
        ] as typeof existingInvitation.guest_guestA;

        if (guestName && existingGuest) {
          await tx
            .update(guest)
            .set({
              nameOnInvitation: guestName,
              isAttending: guestAttending,
              hasPlusOne: guestHasPlusOne,
            })
            .where(eq(guest.id, existingGuest.id));
        } else if (!guestName && existingGuest) {
          await tx.delete(guest).where(eq(guest.id, existingGuest.id));
        }
      }

      await tx
        .update(invitation)
        .set({
          guestA: validatedData.guestA,
          guestB: validatedData.guestB,
          guestC: validatedData.guestC,
          guestD: validatedData.guestD,
          guestE: validatedData.guestE,
          guestF: validatedData.guestF,
          guestG: validatedData.guestG,
          guestH: validatedData.guestH,
          inviteGroupName: validatedData.inviteGroupName,
          lastUpdatedAt: new Date().toISOString(),
        })
        .where(eq(invitation.id, validatedData.invitationId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating invitation:", error);
    return NextResponse.json(
      { error: "Failed to update invitation" },
      { status: 500 }
    );
  }
}

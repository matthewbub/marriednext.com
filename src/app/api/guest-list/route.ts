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

    // console.log("data", data);
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

const guestSchema = z.object({
  id: z.string().uuid().optional(),
  nameOnInvitation: z.string().min(1),
  isAttending: z.boolean().nullable(),
  hasPlusOne: z.boolean(),
});

const updateInvitationSchema = z.object({
  invitationId: z.string().uuid(),
  guests: z.array(guestSchema).min(1),
  inviteGroupName: z.string().nullable(),
});

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = updateInvitationSchema.parse(body);

    const existingInvitation = await db.query.invitation.findFirst({
      where: eq(invitation.id, validatedData.invitationId),
      with: {
        guests: true,
      },
    });

    if (!existingInvitation) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    const wedding = await getCurrentWedding();
    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    await db.transaction(async (tx) => {
      const existingGuestIds = existingInvitation.guests.map((g) => g.id);
      const updatedGuestIds = validatedData.guests
        .filter((g) => g.id)
        .map((g) => g.id!);

      const guestsToDelete = existingGuestIds.filter(
        (id) => !updatedGuestIds.includes(id)
      );
      for (const guestId of guestsToDelete) {
        await tx.delete(guest).where(eq(guest.id, guestId));
      }

      for (const guestData of validatedData.guests) {
        if (guestData.id) {
          await tx
            .update(guest)
            .set({
              nameOnInvitation: guestData.nameOnInvitation,
              isAttending: guestData.isAttending,
              hasPlusOne: guestData.hasPlusOne,
            })
            .where(eq(guest.id, guestData.id));
        } else {
          await tx.insert(guest).values({
            weddingId: wedding.id,
            invitationId: validatedData.invitationId,
            nameOnInvitation: guestData.nameOnInvitation,
            isAttending: guestData.isAttending,
            hasPlusOne: guestData.hasPlusOne,
          });
        }
      }

      await tx
        .update(invitation)
        .set({
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

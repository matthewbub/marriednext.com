import { NextResponse } from "next/server";
import { z } from "zod";
import { validateGuest, getCompanionName } from "@/lib/tenant/guestList";
import { GuestType } from "@/lib/tenant/types";
import { insertInvitation } from "@/database/drizzle";
import * as Sentry from "@sentry/nextjs";

const schema = z.object({
  nameOnInvitation: z.string(),
  isAttending: z.boolean(),
  hasPlusOne: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const parse = schema.safeParse(requestBody);

    if (!parse.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const { nameOnInvitation, isAttending, hasPlusOne } = parse.data;

    const guestType: GuestType = validateGuest(nameOnInvitation);
    const companionName = getCompanionName(nameOnInvitation);

    // Compute hasPlusOne strictly per rules:
    // TRUE only if: guest is invited with PLUS_ONE and is attending and answered YES.
    // Otherwise FALSE. Never set TRUE for known companion rows.
    const effectiveHasPlusOne =
      guestType === "GUEST_PLUSONE_INVITED" && isAttending === true
        ? Boolean(hasPlusOne)
        : false;

    // For known companion flows, the client currently sends the companion's
    // attendance in the optional hasPlusOne field. Interpret it here.
    const companionIsAttending =
      guestType === "GUEST_AND_KNOWN_PLUSONE"
        ? Boolean(hasPlusOne) && isAttending === true
        : isAttending;

    if (guestType === "UNKNOWN") {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 });
    }

    // Insert primary guest
    await insertInvitation({
      nameOnInvitation,
      isAttending,
      hasPlusOne: effectiveHasPlusOne,
    });

    // Insert companion guest, if applicable. Never set hasPlusOne for companions.
    if (companionName) {
      await insertInvitation({
        nameOnInvitation: companionName,
        isAttending: companionIsAttending,
        hasPlusOne: false,
      });
    }

    Sentry.captureMessage("RSVP saved", {
      extra: {
        nameOnInvitation,
        isAttending,
        hasPlusOne: effectiveHasPlusOne,
        companionName,
        guestType,
      },
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    Sentry.captureException("Failed to save RSVP", {
      extra: {
        error,
      },
    });
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
}

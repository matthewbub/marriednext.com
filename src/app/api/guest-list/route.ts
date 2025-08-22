import { NextResponse } from "next/server";
import db from "@/database/neon";
import type {
  GuestListResponse,
  Invitation,
  Guest,
  RSVPStatus,
} from "@/lib/types";

export async function GET(): Promise<NextResponse<GuestListResponse>> {
  const invitations =
    (await db`SELECT * FROM invitations WHERE wedding_id = 1;`) as Invitation[];
  const guests = (await db`SELECT guest.*
    FROM guests AS guest
    WHERE guest.invitation_id IN (
      SELECT invitation.id
      FROM invitations AS invitation
      WHERE invitation.wedding_id = 1
    );`) as Guest[];

  return NextResponse.json<GuestListResponse>({
    invitations,
    guests,
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      guestId: number;
      rsvp_status: RSVPStatus;
    };
    const { guestId, rsvp_status } = body;
    if (!guestId || !["yes", "no", "pending"].includes(rsvp_status)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    await db`UPDATE guests SET rsvp_status = ${rsvp_status} WHERE id = ${guestId};`;

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update RSVP" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { findInvitationByGuestName } from "@/lib/tenant/invitationLookup";
import { getWeddingFromRequest } from "@/lib/tenant/getWeddingFromRequest";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

export async function POST(request: Request) {
  try {
    const wedding = await getWeddingFromRequest(request);

    if (!wedding) {
      return NextResponse.json({ error: "Wedding not found" }, { status: 404 });
    }

    const body = await request.json();
    const parse = schema.safeParse(body);

    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parse.error.issues },
        { status: 400 }
      );
    }

    const { name } = parse.data;
    const invitation = await findInvitationByGuestName(
      name,
      wedding.id,
      wedding.controlRsvpNameFormat
    );

    if (!invitation) {
      return NextResponse.json(
        { error: "Guest not found on invitation list" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      invitation,
      nameFormat: wedding.controlRsvpNameFormat,
    });
  } catch (error) {
    console.error("Error looking up invitation:", error);
    return NextResponse.json(
      { error: "Failed to lookup invitation" },
      { status: 500 }
    );
  }
}

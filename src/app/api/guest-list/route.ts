import { NextResponse } from "next/server";
import { getGuestList, type DbInvitation } from "@/database/drizzle";

export async function GET(): Promise<
  NextResponse<{ guestList: DbInvitation[] }>
> {
  const guestList = await getGuestList();

  return NextResponse.json({
    guestList,
  });
}

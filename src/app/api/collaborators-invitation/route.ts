import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const mockInvite = {
    id: id || "mock-id",
    senderEmail: "bride@example.com",
    role: "family",
    weddingCouple: "Sarah & John",
    message: "Would love for you to help us plan our special day!",
  };

  return NextResponse.json(mockInvite);
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}

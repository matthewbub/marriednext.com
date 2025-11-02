import { NextResponse } from "next/server";

const mockPermissionsData = {
  currentUser: {
    email: "you@example.com",
    role: "spouse" as const,
  },
  invitations: [
    {
      id: "1",
      email: "partner@example.com",
      role: "spouse" as const,
      status: "accepted" as const,
      message: "Can't wait to plan together!",
      sentAt: "2024-10-15T10:00:00Z",
      acceptedAt: "2024-10-15T14:30:00Z",
    },
    {
      id: "2",
      email: "mom@example.com",
      role: "family" as const,
      status: "accepted" as const,
      sentAt: "2024-10-18T09:15:00Z",
      acceptedAt: "2024-10-18T11:45:00Z",
    },
    {
      id: "3",
      email: "planner@weddings.com",
      role: "planner" as const,
      status: "pending" as const,
      message: "Looking forward to working with you",
      sentAt: "2024-10-25T16:20:00Z",
    },
    {
      id: "4",
      email: "sibling@example.com",
      role: "family" as const,
      status: "declined" as const,
      sentAt: "2024-10-20T13:00:00Z",
      declinedAt: "2024-10-21T08:15:00Z",
    },
  ],
};

export async function GET() {
  return NextResponse.json(mockPermissionsData);
}

export async function PUT(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}

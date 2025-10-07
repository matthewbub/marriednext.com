import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { adminTelemetryEvents } from "@/drizzle/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { componentName, eventType, eventValue, sessionId } = body;

    // Validate required fields
    if (!componentName || !eventType) {
      return NextResponse.json(
        { error: "componentName and eventType are required" },
        { status: 400 }
      );
    }

    // Insert telemetry event
    await db.insert(adminTelemetryEvents).values({
      componentName,
      eventType,
      eventValue: eventValue || null,
      sessionId: sessionId || null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error logging telemetry event:", error);
    return NextResponse.json(
      { error: "Failed to log telemetry event" },
      { status: 500 }
    );
  }
}

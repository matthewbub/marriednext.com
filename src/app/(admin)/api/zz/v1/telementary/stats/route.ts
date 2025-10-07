import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { adminTelemetryEvents } from "@/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    // Get all GuestListDisplay events grouped by session
    const allEvents = await db
      .select({
        sessionId: adminTelemetryEvents.sessionId,
        eventType: adminTelemetryEvents.eventType,
        eventValue: adminTelemetryEvents.eventValue,
      })
      .from(adminTelemetryEvents)
      .where(sql`${adminTelemetryEvents.componentName} = 'GuestListDisplay'`);

    // Group events by session
    const sessionMap = new Map<
      string,
      { hasMount: boolean; toggles: string[] }
    >();

    for (const event of allEvents) {
      const sessionId = event.sessionId || "unknown";
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, { hasMount: false, toggles: [] });
      }

      const sessionData = sessionMap.get(sessionId)!;
      if (event.eventType === "component_mount") {
        sessionData.hasMount = true;
      } else if (event.eventType === "view_mode_toggle" && event.eventValue) {
        sessionData.toggles.push(event.eventValue);
      }
    }

    // Categorize sessions
    let stayedOnDefault = 0;
    let preferExpanded = 0;
    let preferCondensed = 0;

    for (const [sessionId, data] of sessionMap.entries()) {
      // If they have a mount event and no toggles, they stayed on default
      if (data.hasMount && data.toggles.length === 0) {
        stayedOnDefault++;
      }
      // If they toggled (with or without mount event), count their final preference
      else if (data.toggles.length > 0) {
        // Get the last toggle to determine final preference
        const lastToggle = data.toggles[data.toggles.length - 1];
        if (lastToggle === "expanded") {
          preferExpanded++;
        } else if (lastToggle === "condensed") {
          preferCondensed++;
        }
      }
      // If they have no mount and no toggles, skip (shouldn't happen, but defensive)
    }

    return NextResponse.json({
      viewPreference: {
        stayedOnDefault,
        expanded: preferExpanded,
        condensed: preferCondensed,
      },
      totalSessions: sessionMap.size,
    });
  } catch (error) {
    console.error("Error fetching telemetry stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch telemetry stats" },
      { status: 500 }
    );
  }
}

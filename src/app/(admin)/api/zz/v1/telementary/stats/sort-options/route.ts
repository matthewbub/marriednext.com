import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { adminTelemetryEvents } from "@/drizzle/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const allEvents = await db
      .select({
        sessionId: adminTelemetryEvents.sessionId,
        eventType: adminTelemetryEvents.eventType,
        eventValue: adminTelemetryEvents.eventValue,
      })
      .from(adminTelemetryEvents)
      .where(
        sql`${adminTelemetryEvents.componentName} = 'GuestListDisplay' 
        AND (${adminTelemetryEvents.eventType} = 'sort_option_default' 
        OR ${adminTelemetryEvents.eventType} = 'sort_option_change')`
      );

    const sessionMap = new Map<
      string,
      { defaultSort: string | null; changes: string[] }
    >();

    for (const event of allEvents) {
      const sessionId = event.sessionId || "unknown";
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, { defaultSort: null, changes: [] });
      }

      const sessionData = sessionMap.get(sessionId)!;
      if (event.eventType === "sort_option_default" && event.eventValue) {
        sessionData.defaultSort = event.eventValue;
      } else if (event.eventType === "sort_option_change" && event.eventValue) {
        sessionData.changes.push(event.eventValue);
      }
    }

    let stayedOnDefault = 0;
    const sortCounts: Record<string, number> = {
      "alpha-asc": 0,
      "alpha-desc": 0,
      "date-newest": 0,
      "date-oldest": 0,
      "updated-newest": 0,
    };

    for (const [sessionId, data] of sessionMap.entries()) {
      if (data.defaultSort && data.changes.length === 0) {
        stayedOnDefault++;
        sortCounts[data.defaultSort] = (sortCounts[data.defaultSort] || 0) + 1;
      } else if (data.changes.length > 0) {
        const lastSort = data.changes[data.changes.length - 1];
        sortCounts[lastSort] = (sortCounts[lastSort] || 0) + 1;
      }
    }

    return NextResponse.json({
      sortPreference: sortCounts,
      stayedOnDefault,
      totalSessions: sessionMap.size,
    });
  } catch (error) {
    console.error("Error fetching sort option stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch sort option stats" },
      { status: 500 }
    );
  }
}

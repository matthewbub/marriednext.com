import { NextResponse } from "next/server";
import { db } from "@/database/drizzle";
import { adminTelemetryEvents } from "@/drizzle/schema";
import { inArray, count, sql } from "drizzle-orm";

export async function GET() {
  const result = await db
    .select({
      componentName: adminTelemetryEvents.componentName,
      eventType: adminTelemetryEvents.eventType,
      eventValue: adminTelemetryEvents.eventValue,
      count: count(),
    })
    .from(adminTelemetryEvents)
    .where(
      sql`${adminTelemetryEvents.componentName} = 'GuestListDisplay' AND ${adminTelemetryEvents.eventType} IN ('sort_option_change', 'sort_option_default')`
    )
    .groupBy(
      adminTelemetryEvents.componentName,
      adminTelemetryEvents.eventType,
      adminTelemetryEvents.eventValue
    );

  const sortPreference: Record<string, number> = {
    "alpha-asc": 0,
    "alpha-desc": 0,
    "date-newest": 0,
    "date-oldest": 0,
    "updated-newest": 0,
  };

  let totalSessions = 0;
  let stayedOnDefault = 0;

  for (const row of result) {
    const sortValue = row.eventValue as string;
    const rowCount = Number(row.count);

    if (sortValue in sortPreference) {
      sortPreference[sortValue] += rowCount;
      totalSessions += rowCount;

      if (row.eventType === "sort_option_default") {
        stayedOnDefault += rowCount;
      }
    }
  }

  return NextResponse.json({
    sortPreference,
    stayedOnDefault,
    totalSessions,
  });
}

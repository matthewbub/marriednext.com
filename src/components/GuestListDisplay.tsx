"use client";

import { useState, useEffect } from "react";
import { DbInvitationGroupWithGuests } from "@/database/drizzle";
import { LayoutGrid, List } from "lucide-react";
import { telemetry } from "@/lib/telemetry";
import { useDebouncedTelemetry } from "@/hooks/useDebouncedTelemetry";

interface GuestListDisplayProps {
  guestListWithGroups: DbInvitationGroupWithGuests[];
}

export default function GuestListDisplay({
  guestListWithGroups,
}: GuestListDisplayProps) {
  const [viewMode, setViewMode] = useState<"expanded" | "condensed">(
    "expanded"
  );

  const { trackEvent, trackOnMount } = useDebouncedTelemetry({ delay: 3000 });

  // Track component mount after 3 seconds to capture users who stay on default view
  useEffect(() => {
    trackOnMount(() => telemetry.trackGuestListComponentMount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateAttendance = (entry: DbInvitationGroupWithGuests) => {
    let attending = 0;
    let total = 0;

    if (entry.invitation_guestA) {
      total++;
      if (entry.invitation_guestA.isAttending) attending++;
      if (entry.invitation_guestA.hasPlusOne) {
        total++;
        if (entry.invitation_guestA.isAttending) attending++;
      }
    }

    if (entry.invitation_guestB) {
      total++;
      if (entry.invitation_guestB.isAttending) attending++;
      if (entry.invitation_guestB.hasPlusOne) {
        total++;
        if (entry.invitation_guestB.isAttending) attending++;
      }
    }

    return { attending, total };
  };

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => {
            setViewMode("expanded");
            trackEvent(() => telemetry.trackGuestListViewToggle("expanded"));
          }}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "expanded"
              ? "bg-white/40 text-gray-900"
              : "bg-white/10 text-gray-600 hover:bg-white/20"
          }`}
          aria-label="Expanded view"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            setViewMode("condensed");
            trackEvent(() => telemetry.trackGuestListViewToggle("condensed"));
          }}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === "condensed"
              ? "bg-white/40 text-gray-900"
              : "bg-white/10 text-gray-600 hover:bg-white/20"
          }`}
          aria-label="Condensed view"
        >
          <List className="w-5 h-5" />
        </button>
      </div>

      {/* Guest List */}
      <ul className="space-y-3">
        {guestListWithGroups.map((entry) => {
          const { attending, total } = calculateAttendance(entry);
          const guestAAttending = entry.invitation_guestA?.isAttending;
          const guestBAttending = entry.invitation_guestB?.isAttending;
          const guestAHasPlusOne = entry.invitation_guestA?.hasPlusOne;
          const guestBHasPlusOne = entry.invitation_guestB?.hasPlusOne;

          if (viewMode === "condensed") {
            return (
              <li
                key={entry.id}
                className="rounded-xl bg-white/20 border border-white/30 p-4 hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold font-handwritten-font text-gray-900">
                    {entry.guestA}
                    {entry.guestB && (
                      <>
                        <span className="text-stone-600 mx-2">&</span>
                        {entry.guestB}
                      </>
                    )}
                  </h3>
                  <span
                    className={`text-sm font-semibold ${
                      attending === total
                        ? "text-green-700"
                        : attending > 0
                        ? "text-yellow-700"
                        : "text-gray-500"
                    }`}
                  >
                    ({attending}/{total})
                  </span>
                </div>
              </li>
            );
          }

          return (
            <li
              key={entry.id}
              className="rounded-xl bg-white/20 border border-white/30 p-4 hover:bg-white/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold font-handwritten-font text-gray-900">
                  {entry.guestA}
                  {entry.guestB && (
                    <>
                      <span className="text-stone-600 mx-2">&</span>
                      {entry.guestB}
                    </>
                  )}
                </h3>
                <div className="text-right text-xs text-stone-600">
                  #{entry.id}
                </div>
              </div>

              <div className="space-y-2">
                {entry.invitation_guestA && (
                  <>
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/30">
                      <span className="font-medium text-gray-900">
                        {entry.guestA}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          guestAAttending ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {guestAAttending ? "✓ Attending" : "Pending"}
                      </span>
                    </div>
                    {guestAHasPlusOne && (
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/30 ml-4">
                        <span className="font-medium text-gray-700 italic">
                          {entry.guestA}&apos;s Plus One
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            guestAAttending ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {guestAAttending ? "✓ Attending" : "Pending"}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {entry.invitation_guestB && (
                  <>
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/30">
                      <span className="font-medium text-gray-900">
                        {entry.guestB}
                      </span>
                      <span
                        className={`text-sm font-semibold ${
                          guestBAttending ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {guestBAttending ? "✓ Attending" : "Pending"}
                      </span>
                    </div>
                    {guestBHasPlusOne && (
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/30 ml-4">
                        <span className="font-medium text-gray-700 italic">
                          {entry.guestB}&apos;s Plus One
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            guestBAttending ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {guestBAttending ? "✓ Attending" : "Pending"}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {entry.createdAt && (
                <p className="text-xs text-stone-600 mt-3">
                  Created:{" "}
                  {new Date(entry.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

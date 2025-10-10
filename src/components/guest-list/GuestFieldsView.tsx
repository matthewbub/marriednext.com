"use client";

import clsx from "clsx";
import { GuestFieldsViewProps } from "@/components/guest-list/guestList.types";

export default function GuestFieldsView({ entry }: GuestFieldsViewProps) {
  const guests = [
    { name: entry.guestA, invitation: entry.invitation_guestA },
    { name: entry.guestB, invitation: entry.invitation_guestB },
    { name: entry.guestC, invitation: entry.invitation_guestC },
    { name: entry.guestD, invitation: entry.invitation_guestD },
    { name: entry.guestE, invitation: entry.invitation_guestE },
    { name: entry.guestF, invitation: entry.invitation_guestF },
    { name: entry.guestG, invitation: entry.invitation_guestG },
    { name: entry.guestH, invitation: entry.invitation_guestH },
  ].filter((guest) => guest.name && guest.invitation);

  const guestAHasPlusOne = entry.invitation_guestA?.hasPlusOne;
  const guestAAttending = entry.invitation_guestA?.isAttending;
  const hasOnlyOneGuest = guests.length === 1;

  return (
    <>
      {guests.map((guest, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-200"
        >
          <span className="font-semibold text-gray-900">{guest.name}</span>
          <span
            className={clsx(
              "text-sm font-bold",
              guest.invitation?.isAttending && "text-green-700",
              !guest.invitation?.isAttending && "text-gray-600"
            )}
          >
            {guest.invitation?.isAttending ? "✓ Attending" : "Pending"}
          </span>
        </div>
      ))}

      {hasOnlyOneGuest && guestAHasPlusOne && (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 ml-4">
          <span className="font-medium text-gray-800 italic">
            {entry.guestA}&apos;s Plus One
          </span>
          <span
            className={clsx(
              "text-sm font-bold",
              guestAAttending && "text-green-700",
              !guestAAttending && "text-gray-600"
            )}
          >
            {guestAAttending ? "✓ Attending" : "Pending"}
          </span>
        </div>
      )}
    </>
  );
}

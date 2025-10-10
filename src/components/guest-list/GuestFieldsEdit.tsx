"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuestFieldsEditProps } from "@/components/guest-list/guestList.types";

type GuestKey = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";

export default function GuestFieldsEdit({
  editForm,
  onFormChange,
  disabled,
}: GuestFieldsEditProps) {
  const guests: GuestKey[] = ["A", "B", "C", "D", "E", "F", "G", "H"];

  const getGuestValue = (key: GuestKey) => {
    const field = `guest${key}` as keyof typeof editForm;
    return editForm[field] as string | null;
  };

  const getGuestAttending = (key: GuestKey) => {
    const field = `guest${key}Attending` as keyof typeof editForm;
    return editForm[field] as boolean | null;
  };

  const getGuestHasPlusOne = (key: GuestKey) => {
    const field = `guest${key}HasPlusOne` as keyof typeof editForm;
    return editForm[field] as boolean;
  };

  const setGuestValue = (key: GuestKey, value: string | null) => {
    if (key === "A") onFormChange({ ...editForm, guestA: value || "" });
    else if (key === "B") onFormChange({ ...editForm, guestB: value });
    else if (key === "C") onFormChange({ ...editForm, guestC: value });
    else if (key === "D") onFormChange({ ...editForm, guestD: value });
    else if (key === "E") onFormChange({ ...editForm, guestE: value });
    else if (key === "F") onFormChange({ ...editForm, guestF: value });
    else if (key === "G") onFormChange({ ...editForm, guestG: value });
    else if (key === "H") onFormChange({ ...editForm, guestH: value });
  };

  const setGuestAttending = (key: GuestKey, value: boolean | null) => {
    if (key === "A") onFormChange({ ...editForm, guestAAttending: value });
    else if (key === "B") onFormChange({ ...editForm, guestBAttending: value });
    else if (key === "C") onFormChange({ ...editForm, guestCAttending: value });
    else if (key === "D") onFormChange({ ...editForm, guestDAttending: value });
    else if (key === "E") onFormChange({ ...editForm, guestEAttending: value });
    else if (key === "F") onFormChange({ ...editForm, guestFAttending: value });
    else if (key === "G") onFormChange({ ...editForm, guestGAttending: value });
    else if (key === "H") onFormChange({ ...editForm, guestHAttending: value });
  };

  const hasAnyOtherGuests = guests
    .slice(1)
    .some((key) => getGuestValue(key) !== null);

  return (
    <>
      {guests.map((key) => {
        const guestValue = getGuestValue(key);
        const guestAttending = getGuestAttending(key);
        const guestHasPlusOne = getGuestHasPlusOne(key);

        if (key === "A" || guestValue !== null) {
          return (
            <div key={key}>
              <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-200">
                <Input
                  value={guestValue || ""}
                  onChange={(e) => setGuestValue(key, e.target.value || null)}
                  placeholder={`Guest ${key} Name`}
                  className="flex-1"
                  disabled={disabled}
                />
                <Select
                  value={
                    guestAttending === null
                      ? "pending"
                      : guestAttending
                      ? "attending"
                      : "not-attending"
                  }
                  onValueChange={(value) =>
                    setGuestAttending(
                      key,
                      value === "pending" ? null : value === "attending"
                    )
                  }
                  disabled={disabled}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="attending">Attending</SelectItem>
                    <SelectItem value="not-attending">Not Attending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {key === "A" && !hasAnyOtherGuests && (
                <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 ml-4">
                  <span className="text-sm text-gray-700">Plus One:</span>
                  <Select
                    value={guestHasPlusOne ? "yes" : "no"}
                    onValueChange={(value) =>
                      onFormChange({
                        ...editForm,
                        guestAHasPlusOne: value === "yes",
                      })
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </>
  );
}

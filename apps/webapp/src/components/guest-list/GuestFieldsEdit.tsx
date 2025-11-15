"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { GuestFieldsEditProps } from "@/components/guest-list/guestList.types";

export default function GuestFieldsEdit({
  editForm,
  onFormChange,
  disabled,
}: GuestFieldsEditProps) {
  const updateGuest = (index: number, field: string, value: any) => {
    const newGuests = [...editForm.guests];
    newGuests[index] = { ...newGuests[index], [field]: value };
    onFormChange({ ...editForm, guests: newGuests });
  };

  const removeGuest = (index: number) => {
    const newGuests = editForm.guests.filter((_, i) => i !== index);
    onFormChange({ ...editForm, guests: newGuests });
  };

  const addGuest = () => {
    const newGuests = [
      ...editForm.guests,
      { nameOnInvitation: "", isAttending: null, hasPlusOne: false },
    ];
    onFormChange({ ...editForm, guests: newGuests });
  };

  const hasOnlyOneGuest = editForm.guests.length === 1;

  return (
    <>
      {editForm.guests.map((guest, index) => (
        <div key={guest.id || index}>
          <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-200">
            <Input
              value={guest.nameOnInvitation}
              onChange={(e) =>
                updateGuest(index, "nameOnInvitation", e.target.value)
              }
              placeholder="Guest Name"
              className="flex-1"
              disabled={disabled}
            />
            <Select
              value={
                guest.isAttending === null
                  ? "pending"
                  : guest.isAttending
                  ? "attending"
                  : "not-attending"
              }
              onValueChange={(value) =>
                updateGuest(
                  index,
                  "isAttending",
                  value === "pending" ? null : value === "attending"
                )
              }
              disabled={disabled}
            >
              <SelectTrigger
                className="w-[140px]"
                aria-label={`Guest ${index + 1} attendance status`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="not-attending">Not Attending</SelectItem>
              </SelectContent>
            </Select>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGuest(index)}
                disabled={disabled}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {index === 0 && hasOnlyOneGuest && (
            <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-gray-50 border border-gray-200 ml-4">
              <span className="text-sm text-gray-700">Plus One:</span>
              <Select
                value={guest.hasPlusOne ? "yes" : "no"}
                onValueChange={(value) =>
                  updateGuest(index, "hasPlusOne", value === "yes")
                }
                disabled={disabled}
              >
                <SelectTrigger
                  className="w-[100px]"
                  aria-label="Guest plus one status"
                >
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
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addGuest}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Guest
      </Button>
    </>
  );
}

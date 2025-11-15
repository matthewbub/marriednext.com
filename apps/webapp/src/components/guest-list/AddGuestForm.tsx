"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

interface AddGuestFormProps {
  onSubmit: (data: { guests: string[]; hasPlusOne: boolean }) => void;
  isSubmitting?: boolean;
}

export function AddGuestForm({ onSubmit, isSubmitting }: AddGuestFormProps) {
  const [guests, setGuests] = useState<string[]>([""]);
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const lastInputRef = useRef<HTMLInputElement>(null);

  const MAX_GUESTS = 8;
  const showPlusOneCheckbox = guests.length === 1;

  useEffect(() => {
    if (guests.length > 1) {
      setHasPlusOne(false);
    }
  }, [guests.length]);

  const handleAddGuest = () => {
    if (guests.length < MAX_GUESTS) {
      setGuests([...guests, ""]);
      setTimeout(() => {
        lastInputRef.current?.focus();
      }, 0);
    }
  };

  const handleGuestNameChange = (index: number, value: string) => {
    const newGuests = [...guests];
    newGuests[index] = value;
    setGuests(newGuests);
  };

  const handleRemoveGuest = (index: number) => {
    const newGuests = guests.filter((_, i) => i !== index);
    setGuests(newGuests.length === 0 ? [""] : newGuests);
  };

  const handleComplete = () => {
    const filledGuests = guests.filter((g) => g.trim() !== "");
    if (filledGuests.length === 0) {
      return;
    }
    onSubmit({ guests: filledGuests, hasPlusOne });
  };

  const canComplete = guests.some((g) => g.trim() !== "");

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {guests.map((guest, index) => (
          <div key={index}>
            <label
              htmlFor={`guest-${index}`}
              className="block text-sm font-medium mb-1"
            >
              Guest {index + 1} Name
            </label>
            <div className="flex gap-2">
              <Input
                id={`guest-${index}`}
                ref={index === guests.length - 1 ? lastInputRef : null}
                value={guest}
                onChange={(e) => handleGuestNameChange(index, e.target.value)}
                placeholder="Enter guest name"
                disabled={isSubmitting}
                className="flex-1"
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveGuest(index)}
                  disabled={isSubmitting}
                  className="shrink-0"
                  aria-label={`Remove guest ${index + 1}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        {showPlusOneCheckbox && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="plus-one"
              checked={hasPlusOne}
              onCheckedChange={(checked) => setHasPlusOne(checked as boolean)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="plus-one"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add a Plus One
            </label>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAddGuest}
            disabled={guests.length >= MAX_GUESTS || isSubmitting}
            className="flex-1"
          >
            Add Another Guest
          </Button>
          <Button
            type="button"
            onClick={handleComplete}
            disabled={!canComplete || isSubmitting}
            className="flex-1"
          >
            Complete
          </Button>
        </div>
      </div>

      {guests.length >= MAX_GUESTS && (
        <p className="text-xs text-muted-foreground">
          Maximum of {MAX_GUESTS} guests per invitation reached
        </p>
      )}
    </div>
  );
}

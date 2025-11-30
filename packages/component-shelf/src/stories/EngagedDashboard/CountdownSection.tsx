"use client";

import "style-shelf/tailwind";
import { useState, useEffect } from "react";
import { Calendar, Pencil, Check, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface CountdownSectionProps {
  weddingDate: Date;
  coupleName: string;
}

export function CountdownSection({
  weddingDate: initialDate,
  coupleName,
}: CountdownSectionProps) {
  const [weddingDate, setWeddingDate] = useState(initialDate);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = weddingDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  const handleEdit = () => {
    setEditValue(weddingDate.toISOString().split("T")[0]);
    setIsEditing(true);
  };

  const handleSave = () => {
    const newDate = new Date(editValue);
    if (!isNaN(newDate.getTime())) {
      setWeddingDate(newDate);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="rounded-2xl bg-white p-8 md:p-10 border border-[#2c2c2c]/10 shadow-sm">
      <div className="text-center">
        <p className="font-sans text-base text-[#745656] uppercase tracking-widest mb-3">
          Counting down to
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#2c2c2c] mb-4">
          {coupleName}
        </h1>

        <div className="flex items-center justify-center gap-2 text-[#2c2c2c]/70 mb-8">
          <Calendar className="h-5 w-5" />
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-auto bg-[#f5f3eb] border-[#745656]/30 font-sans text-base"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSave}
                className="h-9 w-9 text-green-600 hover:bg-green-100"
              >
                <Check className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancel}
                className="h-9 w-9 text-red-600 hover:bg-red-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <span className="font-sans text-base">
                {weddingDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleEdit}
                className="h-8 w-8 text-[#745656] hover:bg-[#745656]/10"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-xl mx-auto">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="bg-[#f5f3eb] rounded-2xl w-full py-5 md:py-6 border border-[#2c2c2c]/5">
                <span className="font-serif text-3xl md:text-5xl text-[#745656]">
                  {item.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="font-sans text-sm md:text-base text-[#2c2c2c]/60 mt-3 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

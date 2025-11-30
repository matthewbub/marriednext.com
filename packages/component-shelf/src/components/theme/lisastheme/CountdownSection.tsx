"use client";

import "style-shelf/tailwind-hybrid";
import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import labels from "label-shelf/lisastheme";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownSectionCustomization {
  pretextLabel?: string;
  daysLabel?: string;
  hoursLabel?: string;
  minutesLabel?: string;
  secondsLabel?: string;
}

interface CountdownSectionProps {
  eventDate?: string | null;
  customization?: CountdownSectionCustomization;
}

export function CountdownSection({
  eventDate,
  customization = {
    pretextLabel: labels["lisastheme.countdown.pretext.label"],
    daysLabel: labels["lisastheme.countdown.days.label"],
    hoursLabel: labels["lisastheme.countdown.hours.label"],
    minutesLabel: labels["lisastheme.countdown.minutes.label"],
    secondsLabel: labels["lisastheme.countdown.seconds.label"],
  },
}: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = eventDate
      ? new Date(eventDate)
      : new Date("2026-07-26T07:00:00");

    const calculateTimeLeft = () => {
      const now = new Date();
      const totalSeconds = differenceInSeconds(weddingDate, now);

      if (totalSeconds > 0) {
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  const timeUnits = [
    { value: timeLeft.days, label: customization.daysLabel },
    { value: timeLeft.hours, label: customization.hoursLabel },
    { value: timeLeft.minutes, label: customization.minutesLabel },
    { value: timeLeft.seconds, label: customization.secondsLabel },
  ];

  return (
    <section className="py-32 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
          {customization.pretextLabel}
        </p>

        <div className="flex items-center justify-center gap-8 md:gap-16 mt-12">
          {timeUnits.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-8 md:gap-16">
              <div className="text-center">
                <span className="block font-serif text-6xl md:text-8xl text-[#2c2c2c] font-light">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="block mt-3 text-[#745656]/70 tracking-[0.3em] uppercase text-xs">
                  {unit.label}
                </span>
              </div>
              {index < timeUnits.length - 1 && (
                <span className="text-[#745656]/30 text-4xl md:text-5xl font-light hidden md:block">
                  :
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

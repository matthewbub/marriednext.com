"use client";

import "style-shelf/tailwind";
import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import labels from "label-shelf/lisastheme";
import type {
  CountdownSectionCustomization,
  CountdownSectionProps,
  TimeLeft,
} from "./types";
import { EditableLabel } from "../../ui/editable-label";

const defaultCountdownLabels = {
  pretextLabel: labels["lisastheme.countdown.pretext.label"],
  daysLabel: labels["lisastheme.countdown.days.label"],
  hoursLabel: labels["lisastheme.countdown.hours.label"],
  minutesLabel: labels["lisastheme.countdown.minutes.label"],
  secondsLabel: labels["lisastheme.countdown.seconds.label"],
};

export function CountdownSection({
  data,
  customization,
  editable = false,
  onCustomizationChange,
}: CountdownSectionProps) {
  const mergedCustomization = {
    ...defaultCountdownLabels,
    ...customization,
  };
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = data?.eventDate
      ? new Date(data?.eventDate)
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
  }, [data?.eventDate]);

  const handleChange = (
    key: keyof CountdownSectionCustomization,
    value: string
  ) => {
    onCustomizationChange?.(key, value);
  };

  const timeUnits = [
    {
      value: timeLeft.days,
      label: mergedCustomization.daysLabel,
      key: "daysLabel" as const,
    },
    {
      value: timeLeft.hours,
      label: mergedCustomization.hoursLabel,
      key: "hoursLabel" as const,
    },
    {
      value: timeLeft.minutes,
      label: mergedCustomization.minutesLabel,
      key: "minutesLabel" as const,
    },
    {
      value: timeLeft.seconds,
      label: mergedCustomization.secondsLabel,
      key: "secondsLabel" as const,
    },
  ];

  return (
    <section className="@container py-32 bg-[#faf9f6]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {mergedCustomization.pretextLabel && (
          <EditableLabel
            as="p"
            value={mergedCustomization.pretextLabel}
            editable={editable}
            onChange={(v) => handleChange("pretextLabel", v)}
            className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4"
          />
        )}

        <div className="flex flex-col @md:flex-row items-center justify-center gap-8 @md:gap-16 mt-12">
          <div className="text-center">
            <span className="block font-serif text-7xl @md:text-8xl text-[#2c2c2c] font-light">
              {String(timeUnits[0].value).padStart(2, "0")}
            </span>
            {timeUnits[0].label && (
              <EditableLabel
                as="span"
                value={timeUnits[0].label}
                editable={editable}
                onChange={(v) => handleChange(timeUnits[0].key, v)}
                className="block mt-3 text-[#745656]/70 tracking-[0.3em] uppercase text-xs"
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-8 @md:gap-16">
            {timeUnits.slice(1).map((unit, index) => (
              <div key={unit.key} className="flex items-center gap-8">
                <div className="text-center">
                  <span className="block font-serif text-6xl @md:text-8xl text-[#2c2c2c] font-light">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  {unit.label && (
                    <EditableLabel
                      as="span"
                      value={unit.label}
                      editable={editable}
                      onChange={(v) => handleChange(unit.key, v)}
                      className="block mt-3 text-[#745656]/70 tracking-[0.3em] uppercase text-xs"
                    />
                  )}
                </div>
                {index < timeUnits.length - 2 && (
                  <span className="text-[#745656]/30 text-4xl @md:text-5xl font-light hidden @md:block">
                    :
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { CountdownProps, TimeLeft } from "@/lib/tenant/types";

export default function Countdown({
  targetUtcIso = "2026-04-24T00:00:00Z",
  labels,
}: CountdownProps) {
  const targetTimeMs = useMemo(
    () => new Date(targetUtcIso).getTime(),
    [targetUtcIso]
  );

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date().getTime();
    const distance = Math.max(targetTimeMs - now, 0);
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  // Initialize with stable values so SSR and initial client render match
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Sync immediately on mount, then update every second
    setTimeLeft(calculateTimeLeft());
    const intervalId = setInterval(
      () => setTimeLeft(calculateTimeLeft()),
      1000
    );
    return () => clearInterval(intervalId);
  }, [targetTimeMs]);

  return (
    <div
      className="mt-1 mb-6 w-full flex items-center justify-center px-4"
      suppressHydrationWarning
    >
      <div className="flex items-end gap-3 md:gap-8">
        <div className="text-center">
          <div
            className="text-4xl md:text-6xl font-semibold leading-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {timeLeft.days}
          </div>
          <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-700">
            {labels.days}
          </div>
        </div>
        <div className="text-2xl md:text-4xl opacity-50 pb-0.5 mb-5">:</div>
        <div className="text-center">
          <div
            className="text-4xl md:text-6xl font-semibold leading-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-700">
            {labels.hours}
          </div>
        </div>
        <div className="text-2xl md:text-4xl opacity-50 pb-0.5 mb-5">:</div>
        <div className="text-center">
          <div
            className="text-4xl md:text-6xl font-semibold leading-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-700">
            {labels.minutes}
          </div>
        </div>
        <div className="text-2xl md:text-4xl opacity-50 pb-0.5 mb-5">:</div>
        <div className="text-center">
          <div
            className="text-4xl md:text-6xl font-semibold leading-none"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-700">
            {labels.seconds}
          </div>
        </div>
      </div>
    </div>
  );
}

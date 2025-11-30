"use client";

import "style-shelf/tailwind";
import { Users, UserCheck, Clock } from "lucide-react";

interface RsvpStatsProps {
  totalHeadcount: number;
  confirmedRsvps: number;
  pendingRsvps: number;
}

export function RsvpStats({
  totalHeadcount,
  confirmedRsvps,
  pendingRsvps,
}: RsvpStatsProps) {
  const stats = [
    {
      icon: Users,
      value: totalHeadcount,
      label: "Total Headcount",
      color: "bg-[#745656]",
    },
    {
      icon: UserCheck,
      value: confirmedRsvps,
      label: "Confirmed RSVPs",
      color: "bg-green-600",
    },
    {
      icon: Clock,
      value: pendingRsvps,
      label: "Pending RSVPs",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl bg-[#f5f3eb] p-6 border border-[#2c2c2c]/10 flex items-center gap-4"
        >
          <div className={`${stat.color} p-3.5 rounded-full`}>
            <stat.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-serif text-3xl text-[#2c2c2c]">{stat.value}</p>
            <p className="font-sans text-base text-[#2c2c2c]/60">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

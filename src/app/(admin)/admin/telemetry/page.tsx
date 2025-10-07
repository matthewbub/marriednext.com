"use client";

import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { LayoutGrid, List, Loader2, AlertCircle } from "lucide-react";

type TelemetryStats = {
  viewPreference: {
    stayedOnDefault: number;
    expanded: number;
    condensed: number;
  };
  totalSessions: number;
};

export default function TelemetryPage() {
  const { data, isLoading, error } = useQuery<TelemetryStats>({
    queryKey: ["telemetry-stats"],
    queryFn: async () => {
      const res = await fetch("/api/zz/v1/telementary/stats");
      if (!res.ok) throw new Error("Failed to fetch telemetry stats");
      return res.json();
    },
  });

  const totalSessions = data ? data.totalSessions : 0;
  const stayedOnDefaultPercent =
    totalSessions > 0
      ? ((data!.viewPreference.stayedOnDefault / totalSessions) * 100).toFixed(
          1
        )
      : "0.0";
  const expandedPercent =
    totalSessions > 0
      ? ((data!.viewPreference.expanded / totalSessions) * 100).toFixed(1)
      : "0.0";
  const condensedPercent =
    totalSessions > 0
      ? ((data!.viewPreference.condensed / totalSessions) * 100).toFixed(1)
      : "0.0";

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Loading telemetry data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Error loading telemetry data</h3>
              <p className="text-sm text-gray-600">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!data || totalSessions === 0) {
    return (
      <div className="container mx-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Telemetry</h1>
          <p className="text-gray-600">All time</p>
        </div>
        <Card className="p-6">
          <div className="text-center py-12">
            <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold mb-2">
              No telemetry data yet
            </h3>
            <p className="text-gray-600">
              Start using the Guest List Display to see analytics here.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Telemetry</h1>
        <p className="text-gray-600">All time</p>
      </div>

      {/* Guest List View Mode Analytics */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Guest List Display: View Mode Preference (All Users)
        </h2>
        <p className="text-gray-600 mb-6">
          This tracks user preferences based on their session behavior. The
          default view is expanded.
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-gray-600" />
                <span className="font-medium">
                  Stayed on Default (Expanded)
                </span>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {stayedOnDefaultPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full"
                style={{ width: `${stayedOnDefaultPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {data.viewPreference.stayedOnDefault} sessions never toggled
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Toggled to Expanded View</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {expandedPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${expandedPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {data.viewPreference.expanded} sessions ended on expanded
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <List className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Toggled to Condensed View</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {condensedPercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${condensedPercent}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {data.viewPreference.condensed} sessions ended on condensed
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Total Sessions</p>
            <p className="text-3xl font-bold">{data.totalSessions}</p>
          </div>
          <div>
            <p className="text-gray-600">Sessions with Toggles</p>
            <p className="text-3xl font-bold">
              {data.viewPreference.expanded + data.viewPreference.condensed}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

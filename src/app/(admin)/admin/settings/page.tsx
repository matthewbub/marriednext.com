"use client";

import DateCountdownEditor from "@/components/admin/DateCountdownEditor";
import LocationEditor from "@/components/admin/LocationEditor";

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-gray-600">
          Manage your wedding website settings
        </p>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <DateCountdownEditor />
        </div>

        <div className="border rounded-lg p-6">
          <LocationEditor />
        </div>
      </div>
    </div>
  );
}

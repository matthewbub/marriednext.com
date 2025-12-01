"use client";
import { EngagedShell } from "component-shelf";
import { UserButton } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

async function fetchWebsiteBuilder() {
  const res = await fetch("/api/website-builder");
  if (!res.ok) {
    throw new Error("Failed to fetch website builder data");
  }
  return res.json();
}

export default function WebsiteBuilderPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["website-builder"],
    queryFn: fetchWebsiteBuilder,
    retry: 1,
  });

  if (isLoading) {
    return (
      <EngagedShell userButton={<UserButton />}>
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      </EngagedShell>
    );
  }

  if (isError || !data) {
    return (
      <EngagedShell userButton={<UserButton />}>
        <div className="flex items-center justify-center min-h-screen">
          <div>Error loading website data</div>
        </div>
      </EngagedShell>
    );
  }

  const iframeUrl = data.subdomain ? `/tenant/${data.subdomain}` : null;

  return (
    <EngagedShell userButton={<UserButton />}>
      <div className="grid grid-cols-12 mx-auto divide-x divide-gray-200 gap-4">
        <div className="col-span-2 pr-4">
          <div>Sidebar</div>
          <div>
            <Input type="text" placeholder="Enter your name" />
          </div>
        </div>
        <div className="col-span-10">
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className="w-full h-screen border-0"
              title="Website Preview"
            />
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <div>No subdomain available</div>
            </div>
          )}
        </div>
      </div>
    </EngagedShell>
  );
}

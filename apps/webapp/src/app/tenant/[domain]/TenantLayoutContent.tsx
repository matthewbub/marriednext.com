"use client";

import { WeddingDataProvider } from "@/contexts/WeddingDataContext";
import type { WeddingData } from "@/lib/tenant/weddingData.types";

export function TenantLayoutContent({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: WeddingData;
}) {
  return (
    <WeddingDataProvider weddingData={initialData}>
      <div className="w-full">{children}</div>
    </WeddingDataProvider>
  );
}

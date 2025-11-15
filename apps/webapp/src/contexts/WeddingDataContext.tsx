"use client";

import { createContext, useContext } from "react";
import type { WeddingData } from "@/lib/tenant/weddingData.types";

const WeddingDataContext = createContext<WeddingData | null>(null);

export function WeddingDataProvider({
  children,
  weddingData,
}: {
  children: React.ReactNode;
  weddingData: WeddingData;
}) {
  return (
    <WeddingDataContext.Provider value={weddingData}>
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData() {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error("useWeddingData must be used within WeddingDataProvider");
  }
  return context;
}

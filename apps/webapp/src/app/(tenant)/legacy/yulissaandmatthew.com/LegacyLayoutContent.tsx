"use client";

import Header from "@/components/legacy/Header";
import Footer from "@/components/tenant/Footer";
import Swipeable from "@/components/tenant/Swipeable";
import { WeddingDataProvider } from "@/contexts/WeddingDataContext";
import type { WeddingData } from "@/lib/tenant/weddingData.types";

export function LegacyLayoutContent({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: WeddingData;
}) {
  return (
    <WeddingDataProvider weddingData={initialData}>
      <Swipeable>
        <Header weddingData={initialData} />
        <div className="px-4 md:px-0 mx-auto">{children}</div>
        <Footer />
      </Swipeable>
    </WeddingDataProvider>
  );
}

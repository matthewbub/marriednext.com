import type { Metadata } from "next";
import { Cormorant_Infant } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { LegacyLayoutContent } from "./LegacyLayoutContent";
import { getWeddingByDomain } from "@/lib/tenant/getWeddingByDomain";

const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant-infant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yulissa and Matthew's Wedding — April 23, 2026 — Temecula, CA",
    template: "%s | Yulissa and Matthew's Wedding",
  },
  description:
    "Join us in Temecula, CA on April 23, 2026 to celebrate the wedding of Yulissa and Matthew. Find our story, photos, directions to the venue, FAQs, and registry information.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const weddingData = await getWeddingByDomain("yulissaandmatthew");

  if (!weddingData) {
    return (
      <html lang="en">
        <body className={`${cormorantInfant.variable} antialiased`}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-red-600">Wedding not found</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${cormorantInfant.variable} antialiased`}>
        <LegacyLayoutContent initialData={weddingData}>
          {children}
        </LegacyLayoutContent>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Cormorant_Infant } from "next/font/google";
import "style-shelf/tailwind";
import { notFound } from "next/navigation";
import { getWeddingByDomain } from "@/lib/wedding/getWeddingByDomain";
import { BuilderLayoutContent } from "./BuilderLayoutContent";

const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant-infant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Website Builder Preview",
  robots: "noindex, nofollow",
};

export default async function BuilderLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}>) {
  const { domain } = await params;
  const weddingData = await getWeddingByDomain(domain);

  if (!weddingData) {
    notFound();
  }

  return (
    <html lang="en">
      <body className={`${cormorantInfant.variable} antialiased`}>
        <BuilderLayoutContent initialData={weddingData}>
          {children}
        </BuilderLayoutContent>
      </body>
    </html>
  );
}

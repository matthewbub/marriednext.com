import "style-shelf/tailwind";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Married Next — Your Wedding, Your Way",
  description:
    "The free, open-source wedding planning platform. Beautiful websites, smart guest lists, and seamless RSVPs — free to start with optional upgrades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${dmSans.className} ${playfair.className} antialiased bg-transparent`}
        >
          <QueryProvider>
            <div className="mx-auto">{children}</div>
          </QueryProvider>
          <Toaster />
        </body>
        <Analytics />
      </html>
    </ClerkProvider>
  );
}

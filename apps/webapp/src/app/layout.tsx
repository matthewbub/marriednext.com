import "style-shelf/tailwind";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "component-shelf/ui";

const dmSans = DM_Sans({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://marriednext.com"),
  title: {
    default: "Married Next — Your Wedding, Your Way",
    template: "%s | Married Next",
  },
  description:
    "The free, open-source wedding planning platform. Beautiful websites, smart guest lists, and seamless RSVPs — free to start with optional upgrades.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Married Next",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased bg-transparent`}>
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

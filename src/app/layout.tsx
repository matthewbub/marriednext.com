import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import RollingHillsBackground from "@/components/RollingHillsBackground";
import { Rubik, Gloria_Hallelujah } from "next/font/google";
import NavBar from "@/components/NavBar";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/QueryProvider";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const shadowsIntoLight = Gloria_Hallelujah({
  variable: "--font-shadows-into-light",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yulissa and Matthew's Wedding",
  description: "View your guest list and manage who has RSVP'd to the wedding.",
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
          className={`${rubik.variable} ${shadowsIntoLight.variable} antialiased bg-transparent`}
        >
          <QueryProvider>
            <div className="max-w-7xl mx-auto z-10">
              <NavBar />
            </div>
            <div className="max-w-7xl mx-auto">{children}</div>
          </QueryProvider>
        </body>
        <Analytics />
      </html>
    </ClerkProvider>
  );
}

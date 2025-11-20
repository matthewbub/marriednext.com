import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
// import "./engaged/admin-global.css";
import "component-shelf/styles";
import { Rubik, Gloria_Hallelujah, Vollkorn } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

const vullkorn = Vollkorn({
  variable: "--font-vullkorn",
  subsets: ["latin"],
});

const shadowsIntoLight = Gloria_Hallelujah({
  variable: "--font-shadows-into-light",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Married Next",
  description: "Build a beautiful wedding website in minutes.",
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
          className={`${rubik.variable} ${vullkorn.variable} ${shadowsIntoLight.variable} antialiased bg-transparent`}
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

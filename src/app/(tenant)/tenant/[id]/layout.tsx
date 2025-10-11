import type { Metadata } from "next";
import { Cormorant_Infant } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Header from "@/components/tenant/Header";
import Footer from "@/components/tenant/Footer";
import "./globals.css";
import { enUS } from "@/lib/tenant/locales/en-US";
import Swipeable from "@/components/tenant/Swipeable";
import { NextIntlClientProvider } from "next-intl";

const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant-infant",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: enUS.meta.title.default,
    template: enUS.meta.title.template,
  },
  description: enUS.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorantInfant.variable} antialiased`}>
        <NextIntlClientProvider>
          <Swipeable>
            <Header />
            <div className="px-4 md:px-0 mx-auto">{children}</div>
            <Footer />
          </Swipeable>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

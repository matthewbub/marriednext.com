import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import "./admin-global.css";
import "style-shelf/tailwind-hybrid";

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
    <>
      <div className="mn-engaged-layout">{children}</div>
    </>
  );
}

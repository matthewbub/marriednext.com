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
      <NavBar />
      <div className="mx-auto">{children}</div>
    </>
  );
}

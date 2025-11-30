import type { Metadata } from "next";
import "style-shelf/tailwind";

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

"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { LandingPage } from "component-shelf";

export default function Home() {
  const { isSignedIn } = useUser();
  return <LandingPage isAuthenticated={isSignedIn} Link={Link} />;
}

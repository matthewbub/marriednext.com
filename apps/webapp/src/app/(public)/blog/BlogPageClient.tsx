"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationBlogHome,
} from "component-shelf";

export function BlogPageClient() {
  const { isSignedIn } = useUser();
  return (
    <main className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationBlogHome />
      <ApplicationFooter />
    </main>
  );
}


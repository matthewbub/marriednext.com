"use client";

import { useUser } from "@clerk/nextjs";
import { ApplicationNavbar } from "component-shelf";
import { ApplicationFooter } from "component-shelf";
import { ApplicationHelpCenter } from "component-shelf";

export function HelpPageClient() {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <main className="pt-16">
        <ApplicationHelpCenter />
      </main>
      <ApplicationFooter />
    </div>
  );
}


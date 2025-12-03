"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationTemplatesHero,
  ApplicationTemplatesGrid,
  ApplicationTemplatesCta,
} from "component-shelf";

export function TemplatesPageClient() {
  const { isSignedIn } = useUser();
  return (
    <main className="min-h-screen">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationTemplatesHero />
      <ApplicationTemplatesGrid />
      <ApplicationTemplatesCta />
      <ApplicationFooter />
    </main>
  );
}


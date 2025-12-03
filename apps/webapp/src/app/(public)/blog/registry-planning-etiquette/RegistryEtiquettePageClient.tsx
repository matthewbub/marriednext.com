"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationRegistryEtiquetteArticle,
} from "component-shelf";

export function RegistryEtiquettePageClient() {
  const { isSignedIn } = useUser();
  return (
    <main className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationRegistryEtiquetteArticle />
      <ApplicationFooter />
    </main>
  );
}


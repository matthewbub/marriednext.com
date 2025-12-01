"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationRegistryEtiquetteArticle,
} from "component-shelf";

export const metadata = {
  title: "The Complete Guide to Wedding Registry Etiquette | Married Next",
  description:
    "Everything you need to know about creating a thoughtful registry that works for you and your guests — from timing to thank-you notes.",
};

export default function RegistryEtiquettePage() {
  const { isSignedIn } = useUser();
  return (
    <main className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationRegistryEtiquetteArticle />
      <ApplicationFooter />
    </main>
  );
}

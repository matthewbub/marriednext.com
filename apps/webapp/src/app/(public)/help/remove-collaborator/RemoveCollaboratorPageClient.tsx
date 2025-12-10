"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationRemoveCollaboratorArticle,
} from "component-shelf";

export function RemoveCollaboratorPageClient() {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <main className="pt-16">
        <ApplicationRemoveCollaboratorArticle />
      </main>
      <ApplicationFooter />
    </div>
  );
}

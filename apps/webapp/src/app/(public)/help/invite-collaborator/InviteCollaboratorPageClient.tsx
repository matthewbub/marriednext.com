"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationInviteCollaboratorArticle,
} from "component-shelf";

export function InviteCollaboratorPageClient() {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <main className="pt-16">
        <ApplicationInviteCollaboratorArticle />
      </main>
      <ApplicationFooter />
    </div>
  );
}

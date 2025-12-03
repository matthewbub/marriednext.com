"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationConnectDomainArticle,
} from "component-shelf";

export function ConnectDomainPageClient() {
  const { isSignedIn } = useUser();
  return (
    <div className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <main className="pt-16">
        <ApplicationConnectDomainArticle />
      </main>
      <ApplicationFooter />
    </div>
  );
}


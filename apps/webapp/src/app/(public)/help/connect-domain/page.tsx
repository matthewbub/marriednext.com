"use client";

import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationConnectDomainArticle,
} from "component-shelf";

export const metadata = {
  title: "How to Connect Your Domain | Help Center | Married Next",
  description:
    "Learn how to connect your own custom domain to your Married Next wedding website.",
};

export default function ConnectDomainPage() {
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

"use client";

import { useCallback } from "react";
import { ApplicationOnboardingPage } from "component-shelf";
import { LinkWrapper } from "@/components/LinkWrapper";
import { useSession } from "@clerk/nextjs";
import {
  checkSubdomainAvailability,
  createWeddingWithDomain,
} from "@/lib/onboarding/api";

export default function OnboardingPage() {
  const { session } = useSession();

  const handleComplete = useCallback(async () => {
    await session?.reload();
  }, [session]);

  return (
    <ApplicationOnboardingPage
      link={LinkWrapper}
      onSubdomainBlur={checkSubdomainAvailability}
      onSubmit={createWeddingWithDomain}
      onSkip={createWeddingWithDomain}
      onComplete={handleComplete}
    />
  );
}

"use client";

import { ApplicationOnboardingPage } from "component-shelf";
import { LinkWrapper } from "@/components/LinkWrapper";
import {
  checkSubdomainAvailability,
  createWeddingWithDomain,
} from "@/lib/onboarding/api";

export default function OnboardingPage() {
  return (
    <ApplicationOnboardingPage
      link={LinkWrapper}
      onSubdomainBlur={checkSubdomainAvailability}
      onSubmit={createWeddingWithDomain}
      onSkip={createWeddingWithDomain}
    />
  );
}

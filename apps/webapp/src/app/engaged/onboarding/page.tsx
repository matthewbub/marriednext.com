"use client";

import { useCallback } from "react";
import { ApplicationOnboardingPage } from "component-shelf";
import type { ApplicationOnboardingFormData } from "component-shelf";
import { LinkWrapper } from "@/components/LinkWrapper";
import { useSession } from "@clerk/nextjs";
import * as Sentry from "@sentry/nextjs";
import {
  checkSubdomainAvailability,
  createWeddingWithDomain,
} from "@/lib/onboarding/api";

export default function OnboardingPage() {
  const { session } = useSession();

  const handleSubmit = useCallback(
    async (data: ApplicationOnboardingFormData) => {
      const beforeMetadata = session?.user?.publicMetadata;
      Sentry.addBreadcrumb({
        category: "onboarding",
        message: "Before createWeddingWithDomain",
        level: "info",
        data: {
          subdomain: data.subdomain,
          hasSession: !!session,
          beforeMetadata,
        },
      });

      await createWeddingWithDomain(data);

      Sentry.addBreadcrumb({
        category: "onboarding",
        message: "Before session.reload()",
        level: "info",
        data: { hasSession: !!session },
      });

      await session?.reload();

      const afterMetadata = session?.user?.publicMetadata;
      Sentry.addBreadcrumb({
        category: "onboarding",
        message: "After session.reload()",
        level: "info",
        data: {
          afterMetadata,
          metadataChanged: beforeMetadata !== afterMetadata,
        },
      });
    },
    [session]
  );

  return (
    <ApplicationOnboardingPage
      link={LinkWrapper}
      onSubdomainBlur={checkSubdomainAvailability}
      onSubmit={handleSubmit}
      onSkip={handleSubmit}
    />
  );
}

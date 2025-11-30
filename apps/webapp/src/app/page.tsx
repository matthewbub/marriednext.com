"use client";

import { useUser } from "@clerk/nextjs";
import {
  MarriedNextMarketingNavigation,
  ApplicationNavbar,
  ApplicationHeroSection,
  ApplicationFeaturesSection,
  ApplicationHowItWorksSection,
  ApplicationSeatingPlannerSection,
  ApplicationMemoriesSection,
  ApplicationPricingSection,
  ApplicationCtaSection,
  ApplicationFooter,
} from "component-shelf";
import "style-shelf/tailwind";
import "style-shelf/tailwind";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div>
      {/* <MarriedNextMarketingNavigation isAuthenticated={isSignedIn} /> */}
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationHeroSection />
      <ApplicationFeaturesSection />
      <ApplicationHowItWorksSection />
      <ApplicationSeatingPlannerSection />
      <ApplicationMemoriesSection />
      <ApplicationPricingSection />
      <ApplicationCtaSection />
      <ApplicationFooter />
    </div>
  );
}

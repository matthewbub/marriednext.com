"use client";

import { useUser } from "@clerk/nextjs";
import {
  MarriedNextMarketingNavigation,
  MarriedNextMarketingHero,
  MarriedNextMarketingHowItWorks,
  MarriedNextMarketingSeatingPlanner,
  MarriedNextMarketingUploadMemories,
  MarriedNextMarketingFooter,
} from "component-shelf";
import "style-shelf/styles";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <div>
      <MarriedNextMarketingNavigation isAuthenticated={isSignedIn} />
      <MarriedNextMarketingHero />
      <MarriedNextMarketingHowItWorks />
      <MarriedNextMarketingSeatingPlanner />
      <MarriedNextMarketingUploadMemories />
      <MarriedNextMarketingFooter />
    </div>
  );
}

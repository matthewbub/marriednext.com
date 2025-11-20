import {
  MarriedNextMarketingNavigation,
  MarriedNextMarketingHero,
  MarriedNextMarketingHowItWorks,
  MarriedNextMarketingSeatingPlanner,
  MarriedNextMarketingUploadMemories,
  MarriedNextMarketingFooter,
} from "component-shelf";

export default function Home() {
  return (
    <div className="px-4 mx:px-10">
      <MarriedNextMarketingNavigation />
      <MarriedNextMarketingHero />
      <MarriedNextMarketingHowItWorks />
      <MarriedNextMarketingSeatingPlanner />
      <MarriedNextMarketingUploadMemories />
      <MarriedNextMarketingFooter />
    </div>
  );
}

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
  return (
    <div>
      <MarriedNextMarketingNavigation />
      <MarriedNextMarketingHero />
      <MarriedNextMarketingHowItWorks />
      <MarriedNextMarketingSeatingPlanner />
      <MarriedNextMarketingUploadMemories />
      <MarriedNextMarketingFooter />
    </div>
  );
}

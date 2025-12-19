import { Navbar } from "./NavBar";
import type { ApplicationLinkComponent } from "./link-types";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { SaveTheDateSection } from "./SaveTheDateSection";
import { PricingSection } from "./PricingSection";
import { CTASection } from "./CtaSection";
import { Footer } from "./Footer";

export default function LandingPage({
  isAuthenticated,
  Link,
}: {
  isAuthenticated: boolean | undefined;
  Link: ApplicationLinkComponent;
}) {
  return (
    <main className="min-h-screen">
      <Navbar Link={Link} isAuthenticated={isAuthenticated} />
      <HeroSection />
      <HowItWorksSection />
      <SaveTheDateSection />
      <PricingSection />
      <CTASection />
      <Footer Link={Link} />
    </main>
  );
}

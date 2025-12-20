import { Button } from "../ui/button";
import {
  ArrowRight,
  Github,
  Heart,
  Users,
  Calendar,
  Globe,
} from "lucide-react";
import type { ApplicationLinkComponent } from "./link-types";

type HeroSectionProps = {
  Link?: ApplicationLinkComponent;
};

export function HeroSection({ Link = "a" }: HeroSectionProps) {
  const LinkComponent = Link ?? "a";
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-accent" />
            Free Forever • Public Source
          </div>

          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1] text-balance">
            Your wedding,
            <br />
            your way
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
            Beautiful websites. Smart guest lists. Seamless RSVPs. The
            all-in-one wedding planning platform — free forever.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 text-base px-8">
              <LinkComponent href="/dashboard">
                <span className="flex items-center gap-2">
                  Start Planning Free
                  <ArrowRight className="h-4 w-4" />
                </span>
              </LinkComponent>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-base px-8 bg-transparent"
            >
              <LinkComponent href="https://github.com/matthewbub/marriednext.com">
                <span className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  View Source
                </span>
              </LinkComponent>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 md:gap-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span>Ready in minutes</span>
            </div>
          </div>
        </div>

        <div className="mt-20 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="group relative bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                Wedding Website
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Stunning templates. Custom subdomain. Share your story
                beautifully.
              </p>
            </div>

            <div className="group relative bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                Save the Date
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Collect early responses. Gather addresses. Build excitement.
              </p>
            </div>

            <div className="group relative bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                Guest List
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Manage invitations. Track RSVPs. Handle plus-ones with ease.
              </p>
            </div>

            <div className="group relative bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground mb-2">
                Plan Together
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Invite your partner. Add family. Collaborate in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

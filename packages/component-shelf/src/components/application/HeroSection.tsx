import { Button } from "@/components/ui/button"
import { ArrowRight, Github } from "lucide-react"

export function ApplicationHeroSection() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Free to Start • Open Source
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-foreground leading-[1.1] text-balance">
              Your wedding, your way
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Beautiful websites. Smart guest lists. Seamless RSVPs. The all-in-one wedding planning platform couples
              actually love — free to start, with optional upgrades when you need them.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Start Planning Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <Github className="h-4 w-4" />
                View on GitHub
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-serif font-semibold text-foreground">$0</p>
                <p className="text-sm text-muted-foreground">To get started</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-3xl font-serif font-semibold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Open source</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-3xl font-serif font-semibold text-foreground">All-in-One</p>
                <p className="text-sm text-muted-foreground">Website to seating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/elegant-wedding-website-template-mockup-with-flowe.jpg"
                alt="Wedding website preview"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-lg">💌</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">RSVP Received</p>
                  <p className="text-xs text-muted-foreground">Sarah & James are attending!</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">85 Guests</p>
                  <p className="text-xs text-muted-foreground">Confirmed so far</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

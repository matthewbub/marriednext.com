import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"

export function ApplicationCtaSection() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Heart className="h-8 w-8 text-primary fill-primary" />
        </div>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground text-balance">
          Ready to start planning?
        </h2>
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to plan your perfect day — beautiful websites, smart guest lists, and seamless RSVPs. And
          it's free to start.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="gap-2 text-base px-8">
            Create Your Wedding Site
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8 bg-transparent">
            Try the Seating Planner
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required • Free plan available • Open source
        </p>
      </div>
    </section>
  )
}

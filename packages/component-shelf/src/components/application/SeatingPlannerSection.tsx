import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function ApplicationSeatingPlannerSection() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-secondary/50">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">Featured</span>
            <h2 className="mt-2 font-serif text-4xl md:text-5xl font-medium text-foreground text-balance">
              Seating plans made simple
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Drag and drop guests between tables, keep feuding relatives apart, and ensure your best friends are right
              where you want them. Our visual seating planner makes table arrangements actually fun.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Drag-and-drop interface",
                "Auto-suggests optimal arrangements",
                "Handles dietary requirements",
                "Export for caterers & venue",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Button className="mt-8 gap-2">
              Try the Seating Planner
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-border bg-card p-6">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((table) => (
                  <div
                    key={table}
                    className="aspect-square rounded-full border-2 border-dashed border-border flex items-center justify-center bg-secondary/50 hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Table</p>
                      <p className="font-serif font-medium text-foreground">{table}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-2 flex-wrap">
                {["Mom & Dad", "Best Friends", "College Crew", "Work"].map((group) => (
                  <span
                    key={group}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                  >
                    {group}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

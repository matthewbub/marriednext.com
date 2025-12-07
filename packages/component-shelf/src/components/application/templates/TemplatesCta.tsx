import { Button } from "../../../components/ui/button";
import { Palette, ArrowRight } from "lucide-react";

export function ApplicationTemplatesCta() {
  return (
    <section className="py-20 px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <Palette className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground mb-4 text-balance">
          Can't find the perfect match?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
          Every template is fully customizable. Change colors, fonts, layouts,
          and more. Or start from scratch and build something completely unique.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="gap-2">
            Start Customizing
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Request a Design
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Everything you need to plan your perfect wedding",
    features: [
      "Beautiful wedding website",
      "Guest list management",
      "RSVP tracking",
      "Save the Date forms",
      "5 free templates",
      "Unlimited guests",
      "Collaborative planning",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$49",
    period: "one-time",
    description: "Premium templates and custom domain hosting",
    features: [
      "Everything in Free",
      "25+ premium templates",
      "Custom domain hosting",
      "SSL certificate included",
      "Remove branding option",
      "Priority support",
      "Early access to features",
    ],
    cta: "Upgrade to Premium",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-8 bg-secondary/30">
      <div className="mx-auto max-w-3xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-4">
            Simple Pricing
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground text-balance">
            Free for your entire wedding
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Most couples never need to pay. Upgrade only if you want premium
            templates or a custom domain.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-foreground text-background ring-2 ring-foreground"
                  : "bg-card border border-border"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    <Sparkles className="h-3.5 w-3.5" />
                    Best Value
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-medium ${plan.highlighted ? "text-background" : "text-foreground"}`}
                >
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-serif font-semibold ${plan.highlighted ? "text-background" : "text-foreground"}`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={
                      plan.highlighted
                        ? "text-background/70"
                        : "text-muted-foreground"
                    }
                  >
                    /{plan.period}
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm ${plan.highlighted ? "text-background/80" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 flex-shrink-0 ${plan.highlighted ? "text-primary" : "text-primary"}`}
                    />
                    <span
                      className={`text-sm ${plan.highlighted ? "text-background/90" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${plan.highlighted ? "bg-background text-foreground hover:bg-background/90" : ""}`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-sm text-muted-foreground">
          All plans include our core features. Public source means you can view
          all the code anytime.
        </p>
      </div>
    </section>
  );
}

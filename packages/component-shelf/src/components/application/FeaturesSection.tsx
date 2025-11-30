import { Globe, Users, CheckCircle, Palette, Code, Heart } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Beautiful Website",
    description: "Stunning templates designed for elegance, not generic AI slop. Your story, beautifully told.",
  },
  {
    icon: Users,
    title: "Smart Guest List",
    description: "Track RSVPs, manage plus-ones, dietary requirements, and group invitations effortlessly.",
  },
  {
    icon: CheckCircle,
    title: "Seamless RSVPs",
    description: "Guests respond in seconds. You get organized responses instantly.",
  },
  {
    icon: Palette,
    title: "Seating Planner",
    description: "Drag-and-drop seating arrangements that make table planning actually enjoyable.",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Full transparency. Community-driven. Your data stays yours, always.",
  },
  {
    icon: Heart,
    title: "Collaborative",
    description: "Plan together. Invite your partner, wedding party, or parents to help.",
  },
]

export function ApplicationFeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 lg:px-8 bg-secondary/50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground text-balance">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One platform that replaces scattered spreadsheets, expensive software, and endless stress.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

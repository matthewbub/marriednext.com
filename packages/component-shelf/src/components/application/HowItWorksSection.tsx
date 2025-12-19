const steps = [
  {
    number: "01",
    title: "Create your site",
    description:
      "Pick a template, add your photos, and customize your wedding website in minutes.",
  },
  {
    number: "02",
    title: "Build your guest list",
    description:
      "Import contacts or add guests manually. Group families, track addresses, manage plus-ones.",
  },
  {
    number: "03",
    title: "Send invitations",
    description:
      "Share your beautiful website link via email, text, or printed QR codes.",
  },
  {
    number: "04",
    title: "Track & plan",
    description:
      "Watch RSVPs roll in, assign seating, and enjoy a stress-free countdown to your day.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground text-balance">
            From "yes" to "I do" in four simple steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No learning curve. No hidden fees. Just beautiful, simple wedding
            planning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="text-6xl font-serif font-bold text-border mb-4">
                {step.number}
              </div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

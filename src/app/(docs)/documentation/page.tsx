import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Shield,
  Zap,
  ArrowRight,
  Rocket,
  Users,
  Code2,
} from "lucide-react";

const documentationSections = [
  {
    title: "Getting Started",
    href: "/documentation/getting-started",
    description:
      "Everything you need to know to get started with your wedding website",
    icon: Rocket,
    category: "Quick Start",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    title: "Invitations",
    href: "/documentation/invitations",
    description:
      "Learn how to manage guest groups and understand invitation capacity limits",
    icon: Users,
    category: "Guest Management",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Onboarding (The feature)",
    href: "/documentation/developer/onboarding",
    description:
      "Technical overview of the onboarding feature, tech stack, and implementation details",
    icon: Code2,
    category: "Developer",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Multitenant Tricks Next.js",
    href: "/documentation/developer/multitenant-tricks-nextjs",
    description:
      "How we achieve fast tenant app performance using Redis caching and React Server Components",
    icon: Zap,
    category: "Developer",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Help Center
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
            Everything you need to know about using marriednext.com. Explore our
            guides, learn about our features, and understand how we keep your
            data safe.
          </p>
        </div>

        {/* Documentation Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Browse Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentationSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.href} href={section.href} className="group">
                  <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg ${section.bgColor}`}>
                          <Icon className={`w-6 h-6 ${section.color}`} />
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {section.category}
                        </div>
                        <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                          {section.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 p-8 rounded-xl bg-muted/50 border border-dashed border-border">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              More Coming Soon
            </h3>
            <p className="text-muted-foreground">
              We&apos;re constantly improving our documentation. Check back soon
              for guides on RSVP management, guest list features, registry
              integration, and more.
            </p>
          </div>
        </div>

        {/* Help Footer */}
        <div className="mt-12 p-6 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Need More Help?
              </h3>
              <p className="text-sm text-muted-foreground">
                Can&apos;t find what you&apos;re looking for? Contact us
                directly for personalized support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

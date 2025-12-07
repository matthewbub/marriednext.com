import type { ApplicationLinkComponent } from "../link-types";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Gift,
  Users,
  Globe,
  Camera,
  Heart,
  Sparkles,
} from "lucide-react";

const categories = [
  { name: "All", count: 12 },
  { name: "Planning", count: 5 },
  { name: "Etiquette", count: 3 },
  { name: "Budget", count: 2 },
  { name: "Inspiration", count: 2 },
];

const featuredPost = {
  slug: "registry-planning-etiquette",
  title: "The Complete Guide to Wedding Registry Etiquette",
  excerpt:
    "Everything you need to know about creating a thoughtful registry that works for you and your guests — from timing to thank-you notes.",
  category: "Etiquette",
  date: "November 25, 2025",
  readTime: "8 min read",
  icon: Gift,
};

const posts = [
  {
    slug: "seating-chart-tips",
    title: "How to Create a Stress-Free Seating Chart",
    excerpt:
      "Practical tips for organizing your reception seating without the drama.",
    category: "Planning",
    date: "November 20, 2025",
    readTime: "6 min read",
    icon: Users,
  },
  {
    slug: "wedding-website-checklist",
    title: "What to Include on Your Wedding Website",
    excerpt: "The essential pages and information your guests actually need.",
    category: "Planning",
    date: "November 15, 2025",
    readTime: "5 min read",
    icon: Globe,
  },
  {
    slug: "guest-photo-sharing",
    title: "Getting Guests to Share Their Wedding Photos",
    excerpt:
      "Creative ways to collect those candid moments from everyone who attended.",
    category: "Inspiration",
    date: "November 10, 2025",
    readTime: "4 min read",
    icon: Camera,
  },
  {
    slug: "budget-wedding-tips",
    title: "Planning a Beautiful Wedding on a Budget",
    excerpt:
      "Where to splurge, where to save, and how to prioritize what matters most.",
    category: "Budget",
    date: "November 5, 2025",
    readTime: "7 min read",
    icon: Sparkles,
  },
  {
    slug: "rsvp-follow-up",
    title: "How to Follow Up on Missing RSVPs (Politely)",
    excerpt:
      "Scripts and strategies for getting those final headcounts without awkwardness.",
    category: "Etiquette",
    date: "October 30, 2025",
    readTime: "5 min read",
    icon: Heart,
  },
];

interface ApplicationBlogHomeProps {
  Link?: ApplicationLinkComponent;
}

export function ApplicationBlogHome({ Link = "a" }: ApplicationBlogHomeProps) {
  return (
    <div className="pt-24 pb-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Wedding Planning Blog
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4 text-balance">
            Tips & Guides for Your Big Day
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Practical advice, etiquette guides, and inspiration to help you plan
            a wedding that's uniquely yours.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10 bg-background"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {categories.map((category, index) => (
              <Button
                key={category.name}
                variant={index === 0 ? "default" : "outline"}
                size="sm"
                className="shrink-0"
              >
                {category.name}
                <span className="ml-1.5 text-xs opacity-60">
                  ({category.count})
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <Link href={`/blog/${featuredPost.slug}`} className="block mb-10 group">
          <Card className="overflow-hidden border-border hover:border-primary/30 transition-all hover:shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[4/3] md:aspect-auto bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 flex items-center justify-center">
                <div className="p-8">
                  <featuredPost.icon
                    className="h-24 w-24 text-primary/40"
                    strokeWidth={1}
                  />
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{featuredPost.category}</Badge>
                  <Badge
                    variant="outline"
                    className="bg-primary/5 border-primary/20 text-primary"
                  >
                    Featured
                  </Badge>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 text-pretty">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        {/* All Posts Grid */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            All Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group"
              >
                <Card className="h-full border-border hover:border-primary/30 transition-all hover:shadow-md">
                  <div className="aspect-[16/10] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                    <post.icon
                      className="h-12 w-12 text-muted-foreground/40"
                      strokeWidth={1.5}
                    />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {post.category}
                    </Badge>
                    <h3 className="font-serif text-lg font-medium text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Articles
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-16 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-3">
              Get Planning Tips in Your Inbox
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Join couples who receive our weekly newsletter with practical
              advice, etiquette guides, and planning reminders.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background"
              />
              <Button type="submit">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              No spam, unsubscribe anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

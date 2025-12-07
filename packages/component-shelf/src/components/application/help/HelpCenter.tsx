"use client";

import { useState } from "react";
import type { ApplicationLinkComponent } from "../link-types";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Search,
  Globe,
  Users,
  Layout,
  Camera,
  Settings,
  BookOpen,
  ChevronRight,
  Sparkles,
  MessageCircle,
  FileText,
} from "lucide-react";

const categories = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Set up your wedding website in minutes",
    icon: Sparkles,
    articleCount: 8,
    articles: [
      {
        title: "Creating your account",
        slug: "creating-account",
        isPopular: true,
      },
      {
        title: "Choosing a template",
        slug: "choosing-template",
        isPopular: true,
      },
      { title: "Customizing your website", slug: "customizing-website" },
      { title: "Inviting collaborators", slug: "inviting-collaborators" },
    ],
  },
  {
    id: "website-builder",
    title: "Website Builder",
    description: "Design and customize your wedding site",
    icon: Layout,
    articleCount: 12,
    articles: [
      { title: "Editing content and images", slug: "editing-content" },
      { title: "Changing fonts and colors", slug: "fonts-colors" },
      { title: "Adding custom sections", slug: "custom-sections" },
      { title: "Mobile optimization tips", slug: "mobile-optimization" },
    ],
  },
  {
    id: "domains",
    title: "Domains & URLs",
    description: "Connect your own domain or customize your subdomain",
    icon: Globe,
    articleCount: 6,
    articles: [
      {
        title: "How to connect your domain",
        slug: "connect-domain",
        isPopular: true,
      },
      { title: "Customizing your subdomain", slug: "customize-subdomain" },
      { title: "DNS configuration guide", slug: "dns-configuration" },
      {
        title: "Troubleshooting domain issues",
        slug: "domain-troubleshooting",
      },
    ],
  },
  {
    id: "guest-list",
    title: "Guest List & RSVPs",
    description: "Manage your guests and track responses",
    icon: Users,
    articleCount: 10,
    articles: [
      {
        title: "Adding guests and invitations",
        slug: "adding-guests",
        isPopular: true,
      },
      { title: "Setting up RSVP options", slug: "rsvp-options" },
      { title: "Tracking RSVP responses", slug: "tracking-rsvps" },
      { title: "Managing plus-ones", slug: "managing-plus-ones" },
    ],
  },
  {
    id: "seating",
    title: "Seating Planner",
    description: "Organize your reception seating arrangement",
    icon: Settings,
    articleCount: 7,
    articles: [
      {
        title: "Getting started with seating",
        slug: "seating-getting-started",
      },
      { title: "Adding and arranging tables", slug: "arranging-tables" },
      { title: "Assigning guests to seats", slug: "assigning-guests" },
      { title: "Using seating without an account", slug: "seating-standalone" },
    ],
  },
  {
    id: "memories",
    title: "Photo Memories",
    description: "Collect and share wedding photos",
    icon: Camera,
    articleCount: 5,
    articles: [
      { title: "Uploading your photos", slug: "uploading-photos" },
      { title: "Guest photo uploads", slug: "guest-uploads" },
      { title: "Storage limits and upgrades", slug: "storage-limits" },
      { title: "Downloading your gallery", slug: "downloading-gallery" },
    ],
  },
];

const popularArticles = [
  {
    title: "How to connect your domain",
    slug: "connect-domain",
    category: "Domains & URLs",
  },
  {
    title: "Creating your account",
    slug: "creating-account",
    category: "Getting Started",
  },
  {
    title: "Adding guests and invitations",
    slug: "adding-guests",
    category: "Guest List & RSVPs",
  },
  {
    title: "Choosing a template",
    slug: "choosing-template",
    category: "Getting Started",
  },
  {
    title: "Storage limits and upgrades",
    slug: "storage-limits",
    category: "Photo Memories",
  },
];

interface ApplicationHelpCenterProps {
  Link?: ApplicationLinkComponent;
}

export function ApplicationHelpCenter({ Link = "a" }: ApplicationHelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.articles.some((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="h-3 w-3 mr-1" />
            Help Center
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, tutorials, and guides to help you
            create your perfect wedding website.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for articles, guides, or topics..."
              className="pl-12 h-14 text-base rounded-xl border-border bg-card"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Popular Articles */}
        {!searchQuery && (
          <div className="mb-16">
            <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
              Popular Articles
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/help/${article.slug}`}
                  className="group"
                >
                  <Card className="h-full border-border hover:border-primary/30 hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        {article.category}
                      </p>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {article.title}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
            {searchQuery ? "Search Results" : "Browse by Category"}
          </h2>
          {filteredCategories.length === 0 ? (
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  No results found
                </p>
                <p className="text-muted-foreground">
                  Try a different search term or browse our categories below.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  className="border-border hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-medium text-foreground mb-1">
                          {category.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {category.articles.map((article) => (
                        <li key={article.slug}>
                          <Link
                            href={`/help/${article.slug}`}
                            className="flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors group"
                          >
                            <span className="flex items-center gap-2">
                              {article.title}
                              {article.isPopular && (
                                <Badge
                                  variant="outline"
                                  className="text-xs py-0 h-5"
                                >
                                  Popular
                                </Badge>
                              )}
                            </span>
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/help/category/${category.id}`}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      View all {category.articleCount} articles
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Contact Support */}
        <Card className="border-border bg-muted/30">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="p-4 rounded-full bg-primary/10">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-medium text-foreground mb-2">
                  Can't find what you're looking for?
                </h3>
                <p className="text-muted-foreground">
                  Our support team is here to help. Reach out and we'll get back
                  to you within 24 hours.
                </p>
              </div>
              <Link
                href="mailto:support@marriednext.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

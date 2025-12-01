"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Eye, Sparkles, Check, Lock } from "lucide-react";

type TemplateStyle =
  | "all"
  | "modern"
  | "classic"
  | "rustic"
  | "minimal"
  | "romantic";
type TemplateFilter = "all" | "free" | "premium";

interface Template {
  id: string;
  name: string;
  style: Exclude<TemplateStyle, "all">;
  isPremium: boolean;
  previewImage: string;
  features: string[];
  popular?: boolean;
}

const templates: Template[] = [
  {
    id: "evergreen",
    name: "Evergreen",
    style: "modern",
    isPremium: false,
    previewImage: "/elegant-modern-wedding-website-sage-green-minimal.jpg",
    features: ["RSVP form", "Photo gallery", "Event timeline"],
  },
  {
    id: "blush",
    name: "Blush & Gold",
    style: "romantic",
    isPremium: false,
    previewImage: "/romantic-blush-pink-gold-wedding-website-elegant.jpg",
    features: ["RSVP form", "Registry links", "Love story"],
    popular: true,
  },
  {
    id: "monochrome",
    name: "Monochrome",
    style: "minimal",
    isPremium: false,
    previewImage: "/minimal-black-white-wedding-website-clean-typograp.jpg",
    features: ["RSVP form", "Photo gallery", "FAQ section"],
  },
  {
    id: "garden",
    name: "Secret Garden",
    style: "romantic",
    isPremium: true,
    previewImage: "/floral-botanical-garden-wedding-website-romantic-w.jpg",
    features: ["Animated florals", "Guest book", "Music player"],
    popular: true,
  },
  {
    id: "estate",
    name: "Estate",
    style: "classic",
    isPremium: true,
    previewImage: "/classic-elegant-estate-wedding-website-serif-typog.jpg",
    features: ["Video header", "Multi-event support", "Custom fonts"],
  },
  {
    id: "meadow",
    name: "Meadow",
    style: "rustic",
    isPremium: false,
    previewImage: "/rustic-wildflower-meadow-wedding-website-natural-e.jpg",
    features: ["RSVP form", "Photo gallery", "Directions map"],
  },
  {
    id: "noir",
    name: "Noir",
    style: "modern",
    isPremium: true,
    previewImage: "/dark-moody-noir-wedding-website-dramatic-elegant-b.jpg",
    features: ["Dark mode", "Video backgrounds", "Parallax scroll"],
  },
  {
    id: "coastal",
    name: "Coastal",
    style: "minimal",
    isPremium: false,
    previewImage: "/coastal-beach-wedding-website-blue-white-minimal-s.jpg",
    features: ["RSVP form", "Weather widget", "Photo gallery"],
  },
  {
    id: "vineyard",
    name: "Vineyard",
    style: "rustic",
    isPremium: true,
    previewImage: "/vineyard-winery-wedding-website-burgundy-elegant-t.jpg",
    features: ["Wine pairing menu", "Interactive map", "Guest messaging"],
  },
  {
    id: "timeless",
    name: "Timeless",
    style: "classic",
    isPremium: false,
    previewImage: "/timeless-traditional-wedding-website-ivory-elegant.jpg",
    features: ["RSVP form", "Photo gallery", "Event details"],
  },
  {
    id: "aurora",
    name: "Aurora",
    style: "modern",
    isPremium: true,
    previewImage: "/modern-gradient-aurora-wedding-website-colorful-el.jpg",
    features: ["Gradient animations", "3D elements", "Custom cursor"],
    popular: true,
  },
  {
    id: "provence",
    name: "Provence",
    style: "romantic",
    isPremium: false,
    previewImage: "/french-provence-lavender-wedding-website-romantic-.jpg",
    features: ["RSVP form", "Photo gallery", "Travel info"],
  },
];

const styleFilters: { value: TemplateStyle; label: string }[] = [
  { value: "all", label: "All Styles" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "rustic", label: "Rustic" },
  { value: "minimal", label: "Minimal" },
  { value: "romantic", label: "Romantic" },
];

const priceFilters: { value: TemplateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
];

export function ApplicationTemplatesGrid() {
  const [styleFilter, setStyleFilter] = useState<TemplateStyle>("all");
  const [priceFilter, setPriceFilter] = useState<TemplateFilter>("all");

  const filteredTemplates = templates.filter((template) => {
    const matchesStyle =
      styleFilter === "all" || template.style === styleFilter;
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && !template.isPremium) ||
      (priceFilter === "premium" && template.isPremium);
    return matchesStyle && matchesPrice;
  });

  const freeCount = templates.filter((t) => !t.isPremium).length;
  const premiumCount = templates.filter((t) => t.isPremium).length;

  return (
    <section className="py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          {/* Style filters */}
          <div className="flex flex-wrap gap-2">
            {styleFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStyleFilter(filter.value)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  styleFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Price filters */}
          <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
            {priceFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setPriceFilter(filter.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
                  priceFilter === filter.value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter.label}
                {filter.value === "free" && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({freeCount})
                  </span>
                )}
                {filter.value === "premium" && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({premiumCount})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-8">
          Showing {filteredTemplates.length} template
          {filteredTemplates.length !== 1 ? "s" : ""}
        </p>

        {/* Templates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No templates match your filters.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setStyleFilter("all");
                setPriceFilter("all");
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-card rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Preview image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img
          src={template.previewImage || "/placeholder.svg"}
          alt={`${template.name} template preview`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay on hover */}
        <div
          className={`absolute inset-0 bg-foreground/60 flex items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button size="sm" variant="secondary" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button size="sm" className="gap-2">
            {template.isPremium ? (
              <>
                <Lock className="h-4 w-4" />
                Unlock
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Use Free
              </>
            )}
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.isPremium ? (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
              <Sparkles className="h-3 w-3" />
              Premium
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm"
            >
              Free
            </Badge>
          )}
          {template.popular && (
            <Badge
              variant="secondary"
              className="bg-primary/90 text-primary-foreground backdrop-blur-sm"
            >
              Popular
            </Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {template.name}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {template.style}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {template.features.map((feature) => (
            <span
              key={feature}
              className="inline-flex items-center px-2.5 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

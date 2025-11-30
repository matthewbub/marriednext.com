"use client";

import "style-shelf/tailwind-hybrid";
import { useState, useEffect, useMemo } from "react";
import type { StickyNavProps } from "./types";
import { cn } from "../../../lib/utils";
import labels from "label-shelf/lisastheme";

export function StickyNav({ customization = {} }: StickyNavProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLabels = {
    home: labels["lisastheme.nav.home.label"],
    story: labels["lisastheme.nav.story.label"],
    details: labels["lisastheme.nav.details.label"],
    gallery: labels["lisastheme.nav.gallery.label"],
    rsvp: labels["lisastheme.nav.rsvp.label"],
    ...customization.navLabels,
  };
  const navItems = useMemo(
    () => [
      { label: navLabels.home, href: "#home" },
      { label: navLabels.story, href: "#story" },
      { label: navLabels.details, href: "#details" },
      { label: navLabels.gallery, href: "#gallery" },
      { label: navLabels.rsvp, href: "#rsvp" },
    ],
    [
      navLabels.home,
      navLabels.story,
      navLabels.details,
      navLabels.gallery,
      navLabels.rsvp,
    ]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      const sections = navItems.map((item) => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-[#faf9f6]/95 backdrop-blur-sm py-4 border-b border-[#745656]/10"
          : "bg-transparent py-6"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-12">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-base tracking-[0.2em] uppercase transition-colors duration-300",
              activeSection === item.href.slice(1)
                ? isScrolled
                  ? "text-[#745656]"
                  : "text-white"
                : isScrolled
                ? "text-[#2c2c2c]/70 hover:text-[#745656]"
                : "text-white/90 hover:text-white"
            )}
          >
            {item.label}
            {activeSection === item.href.slice(1) && (
              <span
                className={cn(
                  "absolute -bottom-1 left-0 right-0 h-px",
                  isScrolled ? "bg-[#745656]" : "bg-white"
                )}
              />
            )}
          </a>
        ))}
      </div>
    </nav>
  );
}

"use client";

import "style-shelf/tailwind";
import { useState, useEffect, useMemo, useRef } from "react";
import type { StickyNavCustomization, StickyNavProps } from "./types";
import { cn } from "../../../lib/utils";
import labels from "label-shelf/lisastheme";
import { EditableLabel } from "../../ui/editable-label";

export function StickyNav({
  customization = {},
  editable = false,
  contained = false,
  onCustomizationChange,
}: StickyNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navLabels = {
    home: labels["lisastheme.nav.home.label"],
    story: labels["lisastheme.nav.story.label"],
    details: labels["lisastheme.nav.details.label"],
    gallery: labels["lisastheme.nav.gallery.label"],
    rsvp: labels["lisastheme.nav.rsvp.label"],
    ...customization?.navLabels,
  };

  const handleChange = (
    key: keyof NonNullable<StickyNavCustomization["navLabels"]>,
    value: string
  ) => {
    onCustomizationChange?.(key, value);
  };

  const navItems = useMemo(
    () => [
      { label: navLabels?.home, href: "#home", key: "home" as const },
      { label: navLabels?.story, href: "#story", key: "story" as const },
      { label: navLabels?.details, href: "#details", key: "details" as const },
      { label: navLabels?.gallery, href: "#gallery", key: "gallery" as const },
      { label: navLabels?.rsvp, href: "#rsvp", key: "rsvp" as const },
    ],
    [
      navLabels?.home,
      navLabels?.story,
      navLabels?.details,
      navLabels?.gallery,
      navLabels?.rsvp,
    ]
  );

  useEffect(() => {
    const getScrollContainer = (): HTMLElement | null => {
      if (!contained || !navRef.current) return null;
      let parent = navRef.current.parentElement;
      while (parent) {
        const style = getComputedStyle(parent);
        if (
          style.overflow === "auto" ||
          style.overflow === "scroll" ||
          style.overflowY === "auto" ||
          style.overflowY === "scroll"
        ) {
          return parent;
        }
        parent = parent.parentElement;
      }
      return null;
    };

    const scrollContainer = getScrollContainer();
    const scrollTarget: HTMLElement | Window =
      contained && scrollContainer ? scrollContainer : window;

    const handleScroll = () => {
      const scrollY = scrollContainer
        ? scrollContainer.scrollTop
        : window.scrollY;
      setIsScrolled(scrollY > 100);

      const sections = navItems.map((item) => item?.href?.slice(1));
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

    scrollTarget.addEventListener("scroll", handleScroll);
    return () => scrollTarget.removeEventListener("scroll", handleScroll);
  }, [navItems, contained]);

  return (
    <div className="@md:block hidden">
      <nav
        ref={navRef}
        className={cn(
          contained ? "sticky" : "fixed",
          "top-0 left-0 right-0 z-50 transition-all duration-500",
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
                activeSection === item?.href?.slice(1)
                  ? isScrolled
                    ? "text-[#745656]"
                    : "text-white"
                  : isScrolled
                  ? "text-[#2c2c2c]/70 hover:text-[#745656]"
                  : "text-white/90 hover:text-white"
              )}
            >
              {item?.label && (
                <EditableLabel
                  as="span"
                  value={item?.label}
                  editable={editable}
                  onChange={(v) => handleChange(item.key, v)}
                />
              )}
              {activeSection === item?.href?.slice(1) && (
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
    </div>
  );
}

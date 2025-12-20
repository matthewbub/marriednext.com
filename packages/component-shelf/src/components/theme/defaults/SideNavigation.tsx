"use client";

import type { ApplicationLinkComponent } from "../../application/link-types";
import { Twirl as Hamburger } from "hamburger-react";
// import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type GSAPTimelineLike = {
  fromTo: (
    target: Element | Element[] | null,
    fromVars: Record<string, unknown>,
    toVars: Record<string, unknown>,
    position?: string
  ) => GSAPTimelineLike;
  to: (
    target: Element | Element[] | null,
    toVars: Record<string, unknown>,
    position?: string
  ) => GSAPTimelineLike;
  kill?: () => void;
};

type GSAPLike = {
  set: (
    target: Element | Element[] | null,
    vars: Record<string, unknown>
  ) => void;
  timeline: (vars?: Record<string, unknown>) => GSAPTimelineLike;
};

type NavLink = {
  href: string;
  label: string;
};

type SideNavigationProps = {
  navLinks: NavLink[];
  getNavItemClass: (href: string) => string;
  ariaLabel: string;
  Link?: ApplicationLinkComponent;
};

export default function SideNavigation({
  navLinks,
  getNavItemClass,
  ariaLabel,
  Link: LinkComponent = "a",
}: SideNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Link = LinkComponent || "a";

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  // GSAP-driven overlay/menu animations
  useEffect(() => {
    let isCancelled = false;
    let tl: GSAPTimelineLike | null = null;

    (async () => {
      try {
        const mod = (await import("gsap")) as unknown as
          | { gsap?: GSAPLike; default?: GSAPLike }
          | GSAPLike;
        if (isCancelled) return;
        const gsapLib: GSAPLike =
          (mod as { gsap?: GSAPLike; default?: GSAPLike }).gsap ??
          (mod as { gsap?: GSAPLike; default?: GSAPLike }).default ??
          (mod as GSAPLike);

        const overlay = overlayRef.current;
        const items = listRef.current
          ? Array.from(listRef.current.querySelectorAll("li"))
          : [];
        if (!overlay) return;

        if (isMenuOpen) {
          gsapLib.set(overlay, {
            visibility: "visible",
            pointerEvents: "auto",
          });
          tl = gsapLib
            .timeline()
            .fromTo(
              overlay,
              { opacity: 0 },
              { opacity: 1, duration: 0.35, ease: "power2.out" }
            )
            .fromTo(
              items,
              { y: 16, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.06,
              },
              "-=0.1"
            );
        } else {
          const exitItems = [...items].reverse();
          tl = gsapLib.timeline({
            onComplete: () =>
              gsapLib.set(overlay, {
                visibility: "hidden",
                pointerEvents: "none",
              }),
          });
          tl.to(exitItems, {
            y: 16,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
            stagger: 0.05,
          }).to(
            overlay,
            { opacity: 0, duration: 0.3, ease: "power2.in" },
            "-=0.05"
          );
        }
      } catch {
        const overlay = overlayRef.current;
        if (!overlay) return;
        if (isMenuOpen) {
          overlay.style.visibility = "visible";
          overlay.style.opacity = "1";
          overlay.style.pointerEvents = "auto";
        } else {
          overlay.style.opacity = "0";
          overlay.style.visibility = "hidden";
          overlay.style.pointerEvents = "none";
        }
      }
    })();

    return () => {
      isCancelled = true;
      if (tl && typeof tl.kill === "function") tl.kill();
    };
  }, [isMenuOpen]);

  return (
    <div>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Hamburger
          toggled={isMenuOpen}
          toggle={setIsMenuOpen}
          rounded
          size={28}
          label={ariaLabel}
        />
      </div>

      <div
        ref={overlayRef}
        aria-hidden={!isMenuOpen}
        className="md:hidden fixed inset-0 z-40 flex items-center justify-center"
        style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
      >
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm" />
        <ul
          ref={listRef}
          className="relative flex flex-col items-center gap-6 text-2xl tracking-wider"
        >
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={getNavItemClass(link.href)}
              onClick={() => setIsMenuOpen(false)}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

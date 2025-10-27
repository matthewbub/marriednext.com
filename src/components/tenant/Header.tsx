"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import MobileSidenav from "./MobileSidenav";
import Countdown from "./Countdown";

export default function Header() {
  const pathname = usePathname();

  const getNavItemClass = (href: string) =>
    `border-b-2 ${
      pathname === href
        ? "border-current"
        : "border-transparent hover:border-current"
    } transition`;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/our-story", label: "Our Story" },
    { href: "/photos", label: "Photos" },
    { href: "/wedding-party", label: "Wedding Party" },
    { href: "/q-and-a", label: "Q + A" },
    { href: "/travel", label: "Travel" },
    { href: "/registry", label: "Registry" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <MobileSidenav
        navLinks={navLinks}
        getNavItemClass={getNavItemClass}
        ariaLabel="Toggle navigation"
      />

      <span className="text-4xl md:text-5xl font-bold md:font-normal mb-18 md:mb-24 uppercase mt-20 md:mt-40 flex flex-col md:flex-row items-center justify-center gap-4">
        The{" "}
        <span className="abramo-script text-[124px] font-normal inline-block px-2 normal-case tracking-wider">
          {" Wedding "}
        </span>
        of
      </span>
      <h1 className="text-6xl mb-8 uppercase tracking-[8px] text-center">
        <span className="md:block hidden">Yulissa & Matthew</span>
        <span className="md:hidden block text-4xl">Yulissa</span>
        <span className="md:hidden block text-4xl">&</span>
        <span className="md:hidden block text-4xl">Matthew</span>
      </h1>

      <h2 className="text-2xl inline-block mt-10 uppercase text-center">
        April 23, 2026 • Temecula, CA
      </h2>

      <Countdown
        targetUtcIso="2026-04-24T00:00:00Z"
        labels={{
          days: "Days",
          hours: "Hours",
          minutes: "Minutes",
          seconds: "Seconds",
        }}
      />

      <ul className="hidden md:flex flex-row flex-wrap items-center gap-4 md:gap-6 text-[20px] font-bold mt-20 tracking-wider justify-center sticky top-0 w-full bg-background z-10 py-4">
        {navLinks.map((link, index) => (
          <Fragment key={link.href}>
            <li className={getNavItemClass(link.href)}>
              <Link href={link.href}>{link.label}</Link>
            </li>
            {index < navLinks.length - 1 && (
              <li aria-hidden className="select-none opacity-50 px-1">
                |
              </li>
            )}
          </Fragment>
        ))}
      </ul>
    </div>
  );
}

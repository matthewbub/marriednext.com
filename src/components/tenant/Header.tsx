"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { getLocale } from "@/lib/tenant/locales/en-US";
import MobileSidenav from "./MobileSidenav";
import Countdown from "./Countdown";

export default function Header() {
  const t = getLocale();
  const pathname = usePathname();

  const getNavItemClass = (href: string) =>
    `border-b-2 ${
      pathname === href
        ? "border-current"
        : "border-transparent hover:border-current"
    } transition`;

  const navLinks = [
    { href: "/", label: t.header.nav.home },
    { href: "/our-story", label: t.header.nav.ourStory },
    { href: "/photos", label: t.header.nav.photos },
    { href: "/wedding-party", label: t.header.nav.weddingParty },
    { href: "/q-and-a", label: t.header.nav.qAndA },
    { href: "/travel", label: t.header.nav.travel },
    { href: "/registry", label: t.header.nav.registry },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <MobileSidenav
        navLinks={navLinks}
        getNavItemClass={getNavItemClass}
        ariaLabel={t.header.aria.toggleNavigation}
      />

      {/* Hero heading */}
      <span className="text-4xl md:text-5xl font-bold md:font-normal mb-18 md:mb-24 uppercase mt-20 md:mt-40 flex flex-col md:flex-row items-center justify-center gap-4">
        {t.header.hero.theWord}{" "}
        <span className="abramo-script text-[124px] font-normal inline-block px-2 normal-case tracking-wider">
          {t.header.hero.weddingWord}
        </span>
        {t.header.hero.ofWord}
      </span>
      <h1 className="text-6xl mb-8 uppercase tracking-[8px] text-center">
        <span className="md:block hidden">{t.header.hero.names}</span>
        <span className="md:hidden block text-4xl">Yulissa</span>
        <span className="md:hidden block text-4xl">&</span>
        <span className="md:hidden block text-4xl">Matthew</span>
      </h1>

      {/* Date and location title line */}
      <h2 className="text-2xl inline-block mt-10 uppercase text-center">
        {t.header.hero.dateLocation}
      </h2>

      <Countdown
        targetUtcIso="2026-04-24T00:00:00Z"
        labels={{
          days: t.header.countdown.days,
          hours: t.header.countdown.hours,
          minutes: t.header.countdown.minutes,
          seconds: t.header.countdown.seconds,
        }}
      />

      {/* Desktop nav */}
      <ul className="hidden md:flex flex-row flex-wrap items-center gap-4 md:gap-6 text-[20px] font-bold mt-20 tracking-wider justify-center">
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

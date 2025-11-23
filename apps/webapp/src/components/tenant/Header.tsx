"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import MobileSidenav from "./MobileSidenav";
import Countdown from "./Countdown";
import { WeddingData } from "@/lib/tenant/weddingData.types";
import TheWeddingOfSVG from "./svgs/TheWeddingOf";

type HeaderProps = {
  weddingData: WeddingData;
};

export default function Header({ weddingData }: HeaderProps) {
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
    // { href: "/registry", label: "Registry" },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <MobileSidenav
        navLinks={navLinks}
        getNavItemClass={getNavItemClass}
        ariaLabel="Toggle navigation"
      />

      <TheWeddingOfSVG />

      <h1 className="text-6xl mb-8 uppercase tracking-[8px] text-center">
        <span className="md:block hidden">
          {weddingData.fieldNameA} & {weddingData.fieldNameB}
        </span>
        <span className="md:hidden block text-4xl">
          {weddingData.fieldNameA}
        </span>
        <span className="md:hidden block text-4xl">&</span>
        <span className="md:hidden block text-4xl">
          {weddingData.fieldNameB}
        </span>
      </h1>

      {weddingData.fieldEventDate && (
        <h2 className="text-2xl inline-block mt-10 uppercase text-center">
          {weddingData.fieldEventDate &&
            new Date(weddingData.fieldEventDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          {/* TODO: This should be the city name, but is pending EVR-78 */}
          {weddingData.fieldLocationName &&
            ` · ${weddingData.fieldLocationName}`}
        </h2>
      )}

      {weddingData.fieldEventDate && (
        <Countdown
          targetUtcIso={weddingData.fieldEventDate}
          labels={{
            days: "Days",
            hours: "Hours",
            minutes: "Minutes",
            seconds: "Seconds",
          }}
        />
      )}

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

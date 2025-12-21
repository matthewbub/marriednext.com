"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ApplicationOnboardingPage } from "component-shelf";

const LinkWrapper = ({
  href = "/",
  ...props
}: ComponentPropsWithoutRef<"a">) => {
  return <Link href={href || "/"} {...props} />;
};

export default function OnboardingPage() {
  return <ApplicationOnboardingPage link={LinkWrapper} />;
}

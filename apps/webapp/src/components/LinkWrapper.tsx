import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

export function LinkWrapper({
  href = "/",
  ...props
}: ComponentPropsWithoutRef<"a">) {
  return <Link href={href || "/"} {...props} />;
}


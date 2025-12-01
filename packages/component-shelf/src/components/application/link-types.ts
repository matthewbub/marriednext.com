import type { ComponentPropsWithoutRef, ElementType } from "react";

export type ApplicationLinkProps = ComponentPropsWithoutRef<"a"> & {
  href: string;
};

export type ApplicationLinkComponent = ElementType<ApplicationLinkProps>;


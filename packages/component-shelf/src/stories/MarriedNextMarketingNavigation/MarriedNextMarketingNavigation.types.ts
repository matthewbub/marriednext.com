import type { ReactNode } from "react";

export interface MarriedNextMarketingNavLinkTypes {
  link: string;
  label: string;
}
export interface MarriedNextMarketingNavigationPropTypes {
  isAuthenticated?: boolean;
  titleLabel?: string;
  navLinks?: MarriedNextMarketingNavLinkTypes[];
  authActions?: ReactNode;
}

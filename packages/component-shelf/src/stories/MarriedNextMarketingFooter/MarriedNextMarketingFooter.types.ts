interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  listLabel: string;
  links: FooterLink[];
}

export interface MarriedNextMarketingFooterTypes {
  brandingLabel?: string;
  footerLinkGroups?: FooterLinkGroup[];
  ctaButtonLabel?: string;
  copyrightLine1?: string;
  copyrightLine2?: string;
}


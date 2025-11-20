import type { MarriedNextMarketingFooterTypes } from "./MarriedNextMarketingFooter.types";

export const marriedNextMarketingFooterDefaults: MarriedNextMarketingFooterTypes = {
  brandingLabel: "Married Next",
  footerLinkGroups: [
    {
      listLabel: "Product",
      links: [
        {
          label: "Website Templates",
          href: "/templates",
        },
        {
          label: "Pricing",
          href: "/pricing",
        },
        {
          label: "Seating Planner",
          href: "/seating-planner",
        },
      ],
    },
    {
      listLabel: "Community",
      links: [
        {
          label: "Developer",
          href: "/developer",
        },
        {
          label: "Changelog",
          href: "/changelog",
        },
        {
          label: "Roadmap",
          href: "/roadmap",
        },
        {
          label: "GitHub",
          href: "https://github.com/matthewbub/marriednext.com",
        },
      ],
    },
    {
      listLabel: "Support",
      links: [
        {
          label: "FAQ",
          href: "/faq",
        },
        {
          label: "Contact",
          href: "/contact",
        },
        {
          label: "Documentation",
          href: "/documentation",
        },
      ],
    },
  ],
  ctaButtonLabel: "Getting Married Next?",
  copyrightLine1: "Code: AGPL-3 — Art: CC BY-SA 4.0",
  copyrightLine2: "© 2025 Married Next. All rights reserved.Version 0.0.1 / Commit e3213fe / 2025",
};


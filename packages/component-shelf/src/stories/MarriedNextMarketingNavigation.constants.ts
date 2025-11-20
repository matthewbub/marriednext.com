import type { MarriedNextMarketingNavigationPropTypes } from "./MarriedNextMarketingNavigation.types";

export const marriedNextMarketingNavigationDefaults: MarriedNextMarketingNavigationPropTypes =
  {
    isAuthenticated: false,
    titleLabel: "Married Next",
    navLinks: [
      {
        label: "About Us",
        link: "/about-us",
      },
      {
        label: "Services",
        link: "/services",
      },

      {
        label: "Templates",
        link: "/templates",
      },
    ],
  };

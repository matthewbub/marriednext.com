import type { Meta } from "@storybook/react-vite";
import { MINIMAL_VIEWPORTS } from "storybook/viewport";

const footerLinkGroups = [
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
];

export const Footer = () => {
  return (
    <footer className="mn-shell mn-footer">
      <div className="mn-footershell">
        <div className="mn-footer-branding">
          <h2 className="mn-footer-branding-label">Married Next</h2>
        </div>

        <div className="mn-footer-link-groups">
          {footerLinkGroups.map((group) => (
            <div key={group.listLabel} className="mn-footer-link-group">
              <div className="mn-footer-link-group-header">
                <h3 className="mn-footer-link-group-label">
                  {group.listLabel}
                </h3>
              </div>

              <div className="mn-footer-content">
                <ul className="mn-footer-link-group-list">
                  {group.links.map((link) => (
                    <li key={link.label} className="mn-footer-link-group-item">
                      <a href={link.href} className="mn-footer-link-group-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="mn-footer-branding-content">
            <a href="mn-outline-button mn-large-button">
              Getting Married Next?
            </a>

            <span className="mn-footer-branding-copyright">
              Code: AGPL-3 — Art: CC BY-SA 4.0
            </span>
            <span className="mn-footer-branding-copyright">
              © 2025 Married Next. All rights reserved.Version 0.0.1 / Commit
              e3213fe / 2025
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const meta = {
  title: "MarriedNext.com Marketing/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    viewport: {
      options: MINIMAL_VIEWPORTS,
    },
  },
  args: {},
  tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;
// type Story = StoryObj<typeof meta>;

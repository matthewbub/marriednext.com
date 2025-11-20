import { marriedNextMarketingFooterDefaults } from "./MarriedNextMarketingFooter.constants";
import type { MarriedNextMarketingFooterTypes } from "./MarriedNextMarketingFooter.types";

export const MarriedNextMarketingFooter = ({
  brandingLabel = marriedNextMarketingFooterDefaults.brandingLabel,
  footerLinkGroups = marriedNextMarketingFooterDefaults.footerLinkGroups,
  ctaButtonLabel = marriedNextMarketingFooterDefaults.ctaButtonLabel,
  copyrightLine1 = marriedNextMarketingFooterDefaults.copyrightLine1,
  copyrightLine2 = marriedNextMarketingFooterDefaults.copyrightLine2,
}: MarriedNextMarketingFooterTypes) => {
  return (
    <footer className="mn-shell mn-footer">
      <div className="mn-footershell">
        <div className="mn-footer-branding">
          <h2 className="mn-footer-branding-label">{brandingLabel}</h2>
        </div>

        <div className="mn-footer-link-groups">
          {footerLinkGroups?.map((group) => (
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
            <a href="mn-outline-button mn-large-button">{ctaButtonLabel}</a>

            <span className="mn-footer-branding-copyright">
              {copyrightLine1}
            </span>
            <span className="mn-footer-branding-copyright">
              {copyrightLine2}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};


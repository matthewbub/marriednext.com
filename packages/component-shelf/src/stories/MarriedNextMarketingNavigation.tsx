import { marriedNextMarketingNavigationDefaults } from "./MarriedNextMarketingNavigation.constants";
import type { MarriedNextMarketingNavigationPropTypes } from "./MarriedNextMarketingNavigation.types";

export const MarriedNextMarketingNavigation = ({
  isAuthenticated = marriedNextMarketingNavigationDefaults.isAuthenticated,
  titleLabel = marriedNextMarketingNavigationDefaults.titleLabel,
  navLinks = marriedNextMarketingNavigationDefaults.navLinks,
}: MarriedNextMarketingNavigationPropTypes) => {
  const useable = navLinks && navLinks.length > 0;
  return (
    <header className="mn-shell mn-header">
      <div className="mn-header-shell">
        <h1 className="mn-page-title">{titleLabel}</h1>

        <nav className="mn-navigation">
          <ul className="mn-navigation-list">
            {useable &&
              navLinks.map((item) => (
                <li className="mn-navigation-list-item">
                  <a className="mn-navigation-link" href={item.link}>
                    {item.label}
                  </a>
                </li>
              ))}
          </ul>

          {isAuthenticated ? (
            <a
              href="/engaged"
              className="mn-navigation-action-button mn-secondary-button"
            >
              My Wedding
            </a>
          ) : (
            <a
              href="/register"
              className="mn-navigation-action-button mn-secondary-button"
            >
              Join for free
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

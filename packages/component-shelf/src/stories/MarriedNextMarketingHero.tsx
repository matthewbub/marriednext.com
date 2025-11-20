import { marriedNextMarketingHeroDefaults } from "./MarriedNextMarketingHero.constants";
import type { MarriedNextMarketingHeroTypes } from "./MarriedNextMarketingHero.types";

export const MarriedNextMarketingHero = ({
  bigText = marriedNextMarketingHeroDefaults.bigText,
  subText = marriedNextMarketingHeroDefaults.subText,
  getStartedLabel = marriedNextMarketingHeroDefaults.getStartedLabel,
  exploreTemplatesLabel = marriedNextMarketingHeroDefaults.exploreTemplatesLabel,
  imageUrl = marriedNextMarketingHeroDefaults.imageUrl,
  imageAlt = marriedNextMarketingHeroDefaults.imageAlt,
  fancyText1 = marriedNextMarketingHeroDefaults.fancyText1,
  fancyText2 = marriedNextMarketingHeroDefaults.fancyText2,
  fancyText3 = marriedNextMarketingHeroDefaults.fancyText3,
  fancyText4 = marriedNextMarketingHeroDefaults.fancyText4,
}: MarriedNextMarketingHeroTypes) => {
  return (
    <div className="mn-shell mn-hero">
      <div className="mn-heroshell">
        <div className="mn-hero-leftside">
          <div className="mn-hero-leftsideshell">
            <h2 className="mn-hero-bigtext">{bigText}</h2>
            <span className="mn-hero-subtext">{subText}</span>

            <div className="mn-hero-buttonsgroup">
              <a className="mn-large-button mn-primary-button">
                {getStartedLabel}
              </a>
              <a className="mn-large-button mn-outline-button">
                {exploreTemplatesLabel}
              </a>
            </div>
          </div>
        </div>

        <div className="mn-hero-rightside">
          <div className="mn-hero-imageshell">
            <img className="mn-hero-image" src={imageUrl} alt={imageAlt} />
          </div>
          <div className="mn-hero-fancytextgroup">
            <span className="mn-hero-fancytext1">{fancyText1}</span>
            <span className="mn-hero-fancytext2">
              {fancyText2}{" "}
              <span className="mn-hero-fancytext3">{fancyText3}</span>
            </span>
            <span className="mn-hero-fancytext4">{fancyText4}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { howItWorksDefaults } from "./MarriedNextMarketingHowItWorks.constants";
import type { HowItWorksTypes } from "./MarriedNextMarketingHowItWorks.types";
import WheelSvg from "./WheelSvg";

export const MarriedNextMarketingHowItWorks = ({
  howItWorksLabel = howItWorksDefaults.howItWorksLabel,
  steps = howItWorksDefaults.steps,
}: HowItWorksTypes) => {
  const useable = steps && steps.length;
  return (
    <section className="mn-shell mn-hiw">
      <div className="mn-hiw-shell">
        <div className="mn-hiw-leftside">
          <h2 className="mn-hiw-titlelabel">{howItWorksLabel}</h2>
        </div>
        <div className="mn-hiw-rightside">
          <div className="mn-hiw-rightsideshell">
            {useable &&
              steps.map((step, index) => (
                <div key={index} className="mn-hiw-card">
                  <WheelSvg className={"mn-hiw-wheel mn-hiw-wheel__" + index} />
                  <h3 className="mn-hiw-cardheading">{step.heading}</h3>
                  <span className="mn-hiw-cardtext">{step.text}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

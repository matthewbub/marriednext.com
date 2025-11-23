import { marriedNextMarketingSeatingPlannerDefaults } from "./MarriedNextMarketingSeatingPlanner.constants";
import type { MarriedNextMarketingSeatingPlannerTypes } from "./MarriedNextMarketingSeatingPlanner.types";

export const MarriedNextMarketingSeatingPlanner = ({
  headingLabel = marriedNextMarketingSeatingPlannerDefaults.headingLabel,
  textLabel = marriedNextMarketingSeatingPlannerDefaults.textLabel,
  buttonLabel = marriedNextMarketingSeatingPlannerDefaults.buttonLabel,
  imageUrl = marriedNextMarketingSeatingPlannerDefaults.imageUrl,
}: MarriedNextMarketingSeatingPlannerTypes) => {
  return (
    <section className="mn-shell mn-seatingplanner">
      <div className="mn-seatingplannershell">
        <div className="mn-seatingplanner-leftside">
          <h2 className="mn-seatingplanner-headinglabel">{headingLabel}</h2>
          <span className="mn-seatingplanner-textlabel">{textLabel}</span>
          <a className="mn-primary-button mn-large-button">{buttonLabel}</a>
        </div>

        <div className="mn-seatingplanner-rightside">
          <img className="mn-seatingplanner-img" src={imageUrl} />
        </div>
      </div>
    </section>
  );
};

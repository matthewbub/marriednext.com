import { marriedNextMarketingUploadMemoriesDefaults } from "./MarriedNextMarketingUploadMemories.constants";
import type { MarriedNextMarketingUploadMemoriesTypes } from "./MarriedNextMarketingUploadMemories.types";

export const MarriedNextMarketingUploadMemories = ({
  headingLabel = marriedNextMarketingUploadMemoriesDefaults.headingLabel,
  textLabel = marriedNextMarketingUploadMemoriesDefaults.textLabel,
  buttonLabel = marriedNextMarketingUploadMemoriesDefaults.buttonLabel,
  imageUrl = marriedNextMarketingUploadMemoriesDefaults.imageUrl,
}: MarriedNextMarketingUploadMemoriesTypes) => {
  return (
    <section className="mn-shell mn-memories">
      <div className="mn-memoriesshell">
        <div className="mn-memories-leftside">
          <img className="mn-memories-img" src={imageUrl} />
        </div>
        <div className="mn-memories-rightside">
          <h2 className="mn-memories-headinglabel">{headingLabel}</h2>
          <span className="mn-memories-textlabel">{textLabel}</span>
          <a className="mn-primary-button mn-large-button">{buttonLabel}</a>
        </div>
      </div>
    </section>
  );
};

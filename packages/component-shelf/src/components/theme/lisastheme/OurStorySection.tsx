import "style-shelf/tailwind-hybrid";
import labels from "label-shelf/lisastheme";
import type {
  Milestone,
  OurStorySectionCustomization,
  OurStorySectionProps,
} from "./types";
import { EditableLabel } from "../../ui/editable-label";

const defaultMilestones: Milestone[] = [
  {
    date: "June 2018",
    title: "First Meeting",
    description:
      "A chance encounter at a mutual friend's gathering changed everything. We talked for hours and knew something special had begun.",
  },
  {
    date: "December 2019",
    title: "First Trip Together",
    description:
      "Our adventure to Big Sur solidified what we already knew—we were meant to explore life together.",
  },
  {
    date: "August 2024",
    title: "The Proposal",
    description:
      "Under the stars at Joshua Tree, Matthew asked the question that would change our lives forever.",
  },
  {
    date: "April 2026",
    title: "Forever Begins",
    description:
      "Surrounded by our loved ones, we'll say 'I do' and begin our greatest adventure yet.",
  },
];

const defaultOurStoryCustomization: OurStorySectionCustomization = {
  pretitleLabel: labels["lisastheme.ourstory.pretitle.label"],
  titleLabel: labels["lisastheme.ourstory.title.label"],
  sectionTextLabel: labels["lisastheme.ourstory.section.text.label"],
  sectionSubtextLabel: labels["lisastheme.ourstory.section.subtext.label"],
};

export function OurStorySection({
  data,
  customization = defaultOurStoryCustomization,
  editable = false,
  onCustomizationChange,
}: OurStorySectionProps) {
  const coupleName =
    data?.nameA && data?.nameB ? `${data?.nameA} and ${data?.nameB}` : "Us";
  const milestones = data?.milestones ?? defaultMilestones;

  const handleChange = (key: keyof OurStorySectionCustomization, value: string) => {
    onCustomizationChange?.(key, value);
  };

  return (
    <section id="story" className="py-32 bg-[#f5f3eb]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          {customization?.pretitleLabel && (
            <EditableLabel
              as="p"
              value={customization?.pretitleLabel}
              editable={editable}
              onChange={(v) => handleChange("pretitleLabel", v)}
              className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4"
            />
          )}
          {customization?.titleLabel && (
            <EditableLabel
              as="h2"
              value={customization?.titleLabel}
              editable={editable}
              onChange={(v) => handleChange("titleLabel", v)}
              className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic"
            />
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="aspect-[4/5] overflow-hidden">
            {data?.imageComponent || (
              <img
                src={
                  data?.imageUrl ||
                  "/romantic-couple-engagement-photo-in-nature-golden-.jpg"
                }
                alt={coupleName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="space-y-8">
            {customization?.sectionTextLabel && (
              <EditableLabel
                as="p"
                value={customization?.sectionTextLabel}
                editable={editable}
                onChange={(v) => handleChange("sectionTextLabel", v)}
                className="text-xl md:text-2xl text-[#2c2c2c]/80 font-light leading-relaxed"
              />
            )}
            {customization?.sectionSubtextLabel && (
              <EditableLabel
                as="p"
                value={customization?.sectionSubtextLabel}
                editable={editable}
                onChange={(v) => handleChange("sectionSubtextLabel", v)}
                className="text-lg text-[#2c2c2c]/70 leading-relaxed"
              />
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#745656]/20 hidden md:block" />

          <div className="space-y-16">
            {milestones.map((milestone, index) => (
              <div
                key={milestone?.title}
                className={`relative grid md:grid-cols-2 gap-8 ${
                  index % 2 === 0 ? "" : "md:direction-rtl"
                }`}
              >
                <div
                  className={`${
                    index % 2 === 0
                      ? "md:text-right md:pr-16"
                      : "md:text-left md:pl-16 md:col-start-2"
                  }`}
                >
                  <span className="text-[#745656] tracking-[0.2em] uppercase text-sm">
                    {milestone?.date}
                  </span>
                  <h3 className="font-serif text-3xl text-[#2c2c2c] mt-2 mb-3 font-light italic">
                    {milestone?.title}
                  </h3>
                  <p className="text-[#2c2c2c]/70 leading-relaxed">
                    {milestone?.description}
                  </p>
                </div>

                <div className="absolute left-1/2 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#745656] hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

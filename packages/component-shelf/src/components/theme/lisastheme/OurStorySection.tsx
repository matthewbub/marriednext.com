import "style-shelf/tailwind-hybrid";
import type React from "react";

interface OurStorySectionProps {
  nameA?: string | null;
  nameB?: string | null;
  imageUrl?: string;
  imageComponent?: React.ReactNode;
}

export function OurStorySection({
  nameA,
  nameB,
  imageUrl,
  imageComponent,
}: OurStorySectionProps) {
  const coupleName = nameA && nameB ? `${nameA} and ${nameB}` : "Us";

  return (
    <section id="story" className="py-32 bg-[#f5f3eb]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
            How It All Began
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic">
            Our Story
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="aspect-[4/5] overflow-hidden">
            {imageComponent || (
              <img
                src={
                  imageUrl ||
                  "/romantic-couple-engagement-photo-in-nature-golden-.jpg"
                }
                alt={coupleName}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-[#2c2c2c]/80 font-light leading-relaxed">
              Some love stories are written in the stars. Ours was written in
              stolen glances, late-night conversations, and the quiet certainty
              that we had found our person.
            </p>
            <p className="text-lg text-[#2c2c2c]/70 leading-relaxed">
              From that first meeting, we knew there was something
              different—something worth holding onto. We're ready to make it
              official, surrounded by the people who matter most to us.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

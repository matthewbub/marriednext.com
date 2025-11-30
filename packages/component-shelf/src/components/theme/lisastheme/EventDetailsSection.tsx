import "style-shelf/tailwind-hybrid";
import { MapPin, Clock, Sparkles } from "lucide-react";
import labels from "label-shelf/lisastheme";
import type { EventDetailsSectionProps } from "./types";

export function EventDetailsSection({
  data,
  customization = {
    headingPretextLabel: labels["lisastheme.details.pretitle.label"],
    headingLabel: labels["lisastheme.details.title.label"],
    ceremonyHeadingLabel: labels["lisastheme.details.ceremony.title.label"],
    ceremonyDescriptionLabel: labels["lisastheme.details.ceremony.text.label"],
    venueHeadingLabel: labels["lisastheme.details.venue.title.label"],
    viewMapLabel: labels["lisastheme.details.venue.button.label"],
    celebrationHeadingLabel:
      labels["lisastheme.details.celebration.title.label"],
    celebrationDescriptionLabel:
      labels["lisastheme.details.celebration.text.1.label"],
    celebrationAttireLabel:
      labels["lisastheme.details.celebration.text.2.label"],
    dressCodeSectionLabel:
      labels["lisastheme.details.dresscode.pretitle.label"],
    dressCodeValueLabel: labels["lisastheme.details.dresscode.title.label"],
    dressCodeNoteLabel: labels["lisastheme.details.dresscode.text.label"],
  },
}: EventDetailsSectionProps) {
  const formattedTime = data.eventTime;
  const addressLines = data.locationAddress?.split("\n") || [];

  return (
    <section id="details" className="py-32 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          {customization?.headingPretextLabel && (
            <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
              {customization.headingPretextLabel}
            </p>
          )}
          {customization?.headingLabel && (
            <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic">
              {customization.headingLabel}
            </h2>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {formattedTime && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[#745656]/30 rounded-full mb-6">
                <Sparkles className="w-6 h-6 text-[#745656]" />
              </div>
              {customization?.ceremonyHeadingLabel && (
                <h3 className="font-serif text-2xl text-[#2c2c2c] mb-4 italic">
                  {customization.ceremonyHeadingLabel}
                </h3>
              )}
              {customization?.ceremonyDescriptionLabel && (
                <p className="text-[#2c2c2c]/70 mb-6 leading-relaxed">
                  {customization.ceremonyDescriptionLabel}
                </p>
              )}
              <div className="space-y-2 text-[#2c2c2c]/80">
                <p className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#745656]" />
                  {formattedTime}
                </p>
              </div>
            </div>
          )}

          {data.locationName && (
            <div
              className={`text-center ${
                formattedTime
                  ? "border-x-0 md:border-x border-[#745656]/10 px-0 md:px-8"
                  : ""
              }`}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[#745656]/30 rounded-full mb-6">
                <MapPin className="w-6 h-6 text-[#745656]" />
              </div>
              {customization?.venueHeadingLabel && (
                <h3 className="font-serif text-2xl text-[#2c2c2c] mb-4 italic">
                  {customization.venueHeadingLabel}
                </h3>
              )}
              <p className="text-[#2c2c2c]/70 mb-6 leading-relaxed">
                {data.locationName}
              </p>
              {addressLines.length > 0 && (
                <address className="not-italic text-[#2c2c2c]/80 space-y-1">
                  {addressLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </address>
              )}
              {data.mapsShareUrl && customization?.viewMapLabel && (
                <a
                  href={data.mapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[#745656] text-sm tracking-[0.2em] uppercase border-b border-[#745656]/30 pb-1 hover:border-[#745656] transition-colors"
                >
                  {customization.viewMapLabel}
                </a>
              )}
            </div>
          )}

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-[#745656]/30 rounded-full mb-6">
              <span className="text-[#745656] text-xl">✦</span>
            </div>
            {customization?.celebrationHeadingLabel && (
              <h3 className="font-serif text-2xl text-[#2c2c2c] mb-4 italic">
                {customization.celebrationHeadingLabel}
              </h3>
            )}
            {customization?.celebrationDescriptionLabel && (
              <p className="text-[#2c2c2c]/70 mb-6 leading-relaxed">
                {customization.celebrationDescriptionLabel}
              </p>
            )}
            {customization?.celebrationAttireLabel && (
              <div className="space-y-2 text-[#2c2c2c]/80">
                <p className="text-sm">
                  {customization.celebrationAttireLabel}
                </p>
              </div>
            )}
          </div>
        </div>

        {(customization?.dressCodeSectionLabel ||
          customization?.dressCodeValueLabel ||
          customization?.dressCodeNoteLabel) && (
          <div className="mt-20 pt-12 border-t border-[#745656]/10 text-center">
            {customization?.dressCodeSectionLabel && (
              <p className="text-[#745656] tracking-[0.3em] uppercase text-sm mb-3">
                {customization.dressCodeSectionLabel}
              </p>
            )}
            {customization?.dressCodeValueLabel && (
              <p className="font-serif text-2xl text-[#2c2c2c] italic">
                {customization.dressCodeValueLabel}
              </p>
            )}
            {customization?.dressCodeNoteLabel && (
              <p className="text-[#2c2c2c]/60 mt-3 max-w-lg mx-auto">
                {customization.dressCodeNoteLabel}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

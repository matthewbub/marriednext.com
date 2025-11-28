import "style-shelf/tailwind-hybrid";
import { MapPin, Clock, Sparkles } from "lucide-react";

interface EventDetailsSectionProps {
  locationName?: string | null;
  locationAddress?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  mapsShareUrl?: string | null;
}

function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return "";
  return timeString;
}

export function EventDetailsSection({
  locationName,
  locationAddress,
  eventTime,
  mapsShareUrl,
}: EventDetailsSectionProps) {
  const formattedTime = formatTime(eventTime);
  const addressLines = locationAddress?.split("\n") || [];

  return (
    <section id="details" className="py-32 bg-[#faf9f6]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
            Join Us On Our Special Day
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic">
            The Details
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {formattedTime && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[#745656]/30 rounded-full mb-6">
                <Sparkles className="w-6 h-6 text-[#745656]" />
              </div>
              <h3 className="font-serif text-2xl text-[#2c2c2c] mb-4 italic">
                The Ceremony
              </h3>
              <p className="text-[#2c2c2c]/70 mb-6 leading-relaxed">
                We invite you to witness our union as we exchange vows and begin
                our forever.
              </p>
              <div className="space-y-2 text-[#2c2c2c]/80">
                <p className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#745656]" />
                  {formattedTime}
                </p>
              </div>
            </div>
          )}

          {locationName && (
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
              <h3 className="font-serif text-2xl text-[#2c2c2c] mb-4 italic">
                The Venue
              </h3>
              <p className="text-[#2c2c2c]/70 mb-6 leading-relaxed">
                {locationName}
              </p>
              {addressLines.length > 0 && (
                <address className="not-italic text-[#2c2c2c]/80 space-y-1">
                  {addressLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </address>
              )}
              {mapsShareUrl && (
                <a
                  href={mapsShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-[#745656] text-sm tracking-[0.2em] uppercase border-b border-[#745656]/30 pb-1 hover:border-[#745656] transition-colors"
                >
                  View Map
                </a>
              )}
            </div>
          )}

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 border border-[#745656]/30 rounded-full mb-6">
              <span className="text-[#745656] text-xl">✦</span>
            </div>
            <h3 className="font-serif text-2xl text-[#2c2c2c] mb-4 italic">
              The Celebration
            </h3>
            <p className="text-[#2c2c2c]/70 mb-6 leading-relaxed">
              Dinner, dancing, and endless memories under the stars.
            </p>
            <div className="space-y-2 text-[#2c2c2c]/80">
              <p className="text-sm">Cocktail attire</p>
            </div>
          </div>
        </div>

        {/* Dress code note */}
        <div className="mt-20 pt-12 border-t border-[#745656]/10 text-center">
          <p className="text-[#745656] tracking-[0.3em] uppercase text-sm mb-3">
            Dress Code
          </p>
          <p className="font-serif text-2xl text-[#2c2c2c] italic">
            Cocktail Attire
          </p>
          <p className="text-[#2c2c2c]/60 mt-3 max-w-lg mx-auto">
            We kindly ask that guests avoid wearing white, ivory, or cream—those
            colors are reserved for the bride.
          </p>
        </div>
      </div>
    </section>
  );
}

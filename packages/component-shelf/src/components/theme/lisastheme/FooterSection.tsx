import "style-shelf/tailwind-hybrid";
import labels from "label-shelf/lisastheme";
import type { FooterSectionProps } from "./types";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function FooterSection({
  data,
  customization = {
    pretitleLabel: labels["lisastheme.footer.pretitle.label"],
    signatureLabel: labels["lisastheme.footer.signature.label"],
  },
}: FooterSectionProps) {
  const coupleName =
    data.nameA && data.nameB ? `${data.nameA} & ${data.nameB}` : "Us";
  const formattedDate = formatDate(data.eventDate);
  const dateLocation = [formattedDate, data.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <footer className="py-20 bg-[#2c2c2c] text-white/80">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="tracking-[0.4em] uppercase text-sm text-white/50 mb-4">
          {customization.pretitleLabel}
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-white font-light italic mb-8">
          {coupleName}
        </h2>
        {dateLocation && <p className="text-white/60 mb-8">{dateLocation}</p>}

        <div className="flex items-center justify-center gap-8 mb-12">
          <span className="w-16 h-px bg-white/20" />
          <span className="text-[#745656] text-2xl">♥</span>
          <span className="w-16 h-px bg-white/20" />
        </div>

        {data.nameA && data.nameB && (
          <p className="text-white/40 text-sm">
            #{data.nameA}And{data.nameB}
            {data.eventDate ? new Date(data.eventDate).getFullYear() : ""}
          </p>
        )}

        <p className="mt-12 text-white/30 text-xs">
          {customization.signatureLabel}
        </p>
      </div>
    </footer>
  );
}

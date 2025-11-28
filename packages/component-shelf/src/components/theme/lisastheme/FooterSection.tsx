import "style-shelf/tailwind-hybrid";

interface FooterSectionProps {
  nameA?: string | null;
  nameB?: string | null;
  eventDate?: string | null;
  location?: string | null;
}

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
  nameA,
  nameB,
  eventDate,
  location,
}: FooterSectionProps) {
  const coupleName = nameA && nameB ? `${nameA} & ${nameB}` : "Us";
  const formattedDate = formatDate(eventDate);
  const dateLocation = [formattedDate, location].filter(Boolean).join(" · ");

  return (
    <footer className="py-20 bg-[#2c2c2c] text-white/80">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="tracking-[0.4em] uppercase text-sm text-white/50 mb-4">
          See You Soon
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

        {nameA && nameB && (
          <p className="text-white/40 text-sm">
            #{nameA}And{nameB}
            {eventDate ? new Date(eventDate).getFullYear() : ""}
          </p>
        )}

        <p className="mt-12 text-white/30 text-xs">
          Made with love using MarriedNext
        </p>
      </div>
    </footer>
  );
}

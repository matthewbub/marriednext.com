import Link from "next/link";
import { getLocale } from "@/lib/tenant/locales/en-US";

export default function Travel() {
  const t = getLocale();

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          {t.pages.travel.title}
        </h1>

        <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            {t.pages.travel.intro}
          </p>
        </div>

        <div className="mb-20">
          {/* <h2 className="text-4xl mb-8 text-center ">Map & Location</h2> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex items-center justify-center h-full w-full">
              <div className="rounded-lg overflow-hidden border border-gray-300 h-full w-fit">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3326.138659292442!2d-117.07583472430605!3d33.52378037336051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db78d683dc711f%3A0x3ae65b808799cd2!2s33515%20Rancho%20California%20Rd%2C%20Temecula%2C%20CA%2092591!5e0!3m2!1sen!2sus!4v1754895261341!5m2!1sen!2sus"
                  width="400"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="flex items-center justify-center h-full">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-2">
                  {t.pages.travel.venueLocation}
                </h3>
                <div className="space-y-1">
                  {t.pages.travel.mapInfo.addressLines.map((line, idx) => (
                    <p key={idx} className="text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      t.pages.travel.mapInfo.mapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-black px-6 py-2 uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  >
                    {t.pages.travel.openInGoogleMaps}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors font-black"
          >
            {t.common.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getLocale } from "@/lib/tenant/locales/en-US";

export default function Travel() {
  const t = getLocale();
  const mapInfo = {
    title: "Venue Location",
    addressLines: ["33515 Rancho California Rd, Temecula, CA 92591"],
    mapQuery: "33515 Rancho California Rd, Temecula, CA 92591",
  };
  const hotels = [
    {
      name: "South Coast Winery",
      address: "34843 Rancho California Rd, Temecula, CA 92591",
      phone: "(951) 566-4622",
      phoneLink: "tel:9515664622",
    },
    {
      name: "Embassy Suites by Hilton Temecula Valley Wine Country",
      address: "29345 Rancho California Rd, Temecula, CA 92591",
      phone: "(951) 676-5656",
      phoneLink: "tel:9516765656",
    },
    {
      name: "Stay Kentina",
      address: "38801 Los Corralitos Rd, Temecula, CA 92592",
      phone: "(951) 514-3120",
      phoneLink: "tel:9515143120",
    },
    {
      name: "Temecula Creek Inn",
      address: "44501 Rainbow Canyon Rd, Temecula, CA 92592",
      phone: "(866) 448-3612",
      phoneLink: "tel:8664483612",
    },
    {
      name: "Pechanga Casino & Resort",
      address: "45000 Pechanga Pkwy, Temecula, CA 92592",
      phone: "(877) 211-2946",
      phoneLink: "tel:8772112946",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          {t.pages.travel.title}
        </h1>

        <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            We're so excited to celebrate with you in beautiful Temecula,
            California! Here's everything you need to know about getting here
            and where to stay.
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
                <h3 className="text-2xl font-semibold mb-2">{mapInfo.title}</h3>
                <div className="space-y-1">
                  {mapInfo.addressLines.map((line, idx) => (
                    <p key={idx} className="text-gray-700">
                      {line}
                    </p>
                  ))}
                </div>
                <div className="mt-4">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      mapInfo.mapQuery
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-2 border-black px-6 py-2 uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                  >
                    Open in Google Maps
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

import Link from "next/link";

export default function Travel() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          Travel
        </h1>

        <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            We're so excited to celebrate with you in beautiful Temecula,
            California! Here's everything you need to know about getting here
            and where to stay.
          </p>
        </div>

        <div className="mb-20">
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
                <h3 className="text-2xl font-semibold mb-2">Venue Location</h3>
                <div className="space-y-1">
                  <p className="text-gray-700">
                    33515 Rancho California Rd, Temecula, CA 92591
                  </p>
                </div>
                <div className="mt-4">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=33515%20Rancho%20California%20Rd%2C%20Temecula%2C%20CA%2092591"
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
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getWeddingByDomain } from "@/lib/tenant/getWeddingByDomain";

export default async function Travel() {
  const weddingData = await getWeddingByDomain("yulissaandmatthew");

  if (!weddingData) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          Travel
        </h1>

        <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-3xl mx-auto">
            We're so excited to celebrate with you! Here's everything you need
            to know about getting here and where to stay.
          </p>
        </div>

        {(weddingData.fieldMapsEmbedUrl ||
          weddingData.fieldLocationAddress) && (
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {weddingData.fieldMapsEmbedUrl && (
                <div className="flex items-center justify-center w-[402px] h-[302px]">
                  <div className="rounded-lg overflow-hidden border border-gray-300 h-full w-fit">
                    <iframe
                      src={weddingData.fieldMapsEmbedUrl}
                      width="400"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center h-full">
                <div>
                  <h3 className="text-center md:text-left text-2xl font-semibold mb-3">
                    Venue Location
                  </h3>
                  <div className="text-center md:text-left">
                    <div className="space-y-1">
                      {weddingData.fieldLocationName && (
                        <h3 className="font-semibold">
                          {weddingData.fieldLocationName}
                        </h3>
                      )}
                      <p className="text-gray-700">
                        {weddingData.fieldLocationAddress}
                      </p>
                    </div>
                  </div>
                  {weddingData.fieldMapsShareUrl && (
                    <div className="mt-4">
                      <a
                        href={weddingData.fieldMapsShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center md:text-left inline-block border-2 border-black px-6 py-2 uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

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

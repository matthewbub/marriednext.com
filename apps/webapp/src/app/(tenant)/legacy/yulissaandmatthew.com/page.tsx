"use client";

import Image from "next/image";
import RsvpFormContainer from "@/components/RsvpFormContainer";
import { useWeddingData } from "@/contexts/WeddingDataContext";

export default function Home() {
  const weddingData = useWeddingData();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mt-20 mb-28 md:px-0 px-4">
        <Image
          src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOsRkrN3Yzk9tQwr7sxHynVo4JE0OBaUh8jlAZ"
          alt={`${weddingData.fieldNameA} and ${weddingData.fieldNameB}`}
          width={420}
          height={500}
          quality={100}
        />
      </div>

      <div id="rsvp">
        <RsvpFormContainer variant="legacy" />
      </div>

      {weddingData.fieldLocationName && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex flex-col items-center justify-center my-2 md:pl-4">
            <h3 className="text-2xl font-semibold abramo-serif">
              {weddingData.fieldLocationName}
            </h3>
            {weddingData.fieldMapsShareUrl &&
              weddingData.fieldLocationAddress && (
                <a
                  href={weddingData.fieldMapsShareUrl}
                  target="_blank"
                  className="text-lg md:text-xl text-gray-700 text-center"
                >
                  {weddingData.fieldLocationAddress
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        {i <
                          weddingData.fieldLocationAddress!.split("\n").length -
                            1 && <br />}
                      </span>
                    ))}
                </a>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

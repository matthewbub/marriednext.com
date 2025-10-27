"use client";

import Image from "next/image";
import RsvpFormContainer from "@/components/RsvpFormContainer";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mt-20 mb-28 md:px-0 px-4">
        <Image
          src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOsRkrN3Yzk9tQwr7sxHynVo4JE0OBaUh8jlAZ"
          alt="Yulissa and Matthew"
          width={420}
          height={500}
          quality={100}
        />
      </div>

      <div id="rsvp">
        <RsvpFormContainer variant="legacy" />
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="flex flex-col items-center justify-center my-2 md:pl-4">
          <h3 className="text-2xl font-semibold abramo-serif">
            Bel Vino Winery
          </h3>
          <a
            href="https://maps.app.goo.gl/LkDA5JTALixqJUGn8"
            target="_blank"
            className="text-lg md:text-xl text-gray-700 text-center"
          >
            33515 Rancho California Road <br />
            Temecula, CA 92591
          </a>
        </div>
      </div>
    </div>
  );
}

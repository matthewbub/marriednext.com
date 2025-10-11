"use client";

import Image from "next/image";
import { getLocale } from "@/lib/tenant/locales/en-US";
import Rsvp from "@/components/tenant/Rsvp";

export default function Home() {
  const t = getLocale();
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mt-20 mb-28 md:px-0 px-4">
        <Image
          src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOsRkrN3Yzk9tQwr7sxHynVo4JE0OBaUh8jlAZ"
          alt={t.pages.home.heroAlt}
          width={420}
          height={500}
          quality={100}
        />
      </div>

      <div id="rsvp">
        <Rsvp />
      </div>

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="flex flex-col items-center justify-center my-2 md:pl-4">
          <h3 className="text-2xl font-semibold abramo-serif">
            {t.pages.home.venueName}
          </h3>
          <a
            href="https://maps.app.goo.gl/LkDA5JTALixqJUGn8"
            target="_blank"
            className="text-lg md:text-xl text-gray-700 text-center"
          >
            {t.pages.home.addressLine1} <br />
            {t.pages.home.addressLine2}
          </a>
        </div>
      </div>
    </div>
  );
}

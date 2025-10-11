// import Link from "next/link";
import { getLocale } from "@/lib/tenant/locales/en-US";
import Image from "next/image";
// import ComingSoon from "@/components/ComingSoon";
import Link from "next/link";

export default function OurStory() {
  const t = getLocale();
  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          {t.pages.ourStory.title}
        </h1>

        {/* <ComingSoon /> */}

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl mb-6 ">
              {t.pages.ourStory.howWeMet.heading}
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              {t.pages.ourStory.howWeMet.story}
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOOm0SDIkSueNsdT9DrfVivQ14LYJKZnXP5HgB"
              alt={t.pages.ourStory.altHowWeMet}
              width={320}
              height={430}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="md:order-2">
            <h2 className="text-3xl mb-6 ">
              {t.pages.ourStory.proposal.heading}
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              {t.pages.ourStory.proposal.story}
            </p>
          </div>
          <div className="md:order-1 flex justify-center">
            <Image
              src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUORJSHeavG80gS6BkbOVwITDxorXjumJAtLCFe"
              alt={t.pages.ourStory.altProposal}
              width={400}
              height={500}
            />
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="btn-primary">
            {t.common.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

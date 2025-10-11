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
            <h2 className="text-3xl mb-6 ">How We Met</h2>
            <p className="text-lg leading-relaxed mb-4">
              We met each other in 2017 at a cozy diner called Angus McCurdys.
              One night, Lisa and I had to split a single dollar for the tip
              jar, passing it back and forth. Over time, we began doodling on it
              each time we traded it. That simple, shared dollar became
              something special, and we’ve been inseparable ever since.
            </p>
          </div>
          <div className="flex justify-center">
            <Image
              src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUOOm0SDIkSueNsdT9DrfVivQ14LYJKZnXP5HgB"
              alt="How We Met"
              width={320}
              height={430}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="md:order-2">
            <h2 className="text-3xl mb-6 ">The Proposal</h2>
            <p className="text-lg leading-relaxed mb-4">
              Mat told me we were heading up to Lookout Peak to show Daniel and
              his wife Daisy the beautiful view while they were in town. To me,
              it felt like just a fun evening—I had no idea what was about to
              happen, so of course we weren’t dressed up for the occasion. When
              we arrived, the sky had the most beautiful sunset. I smiled at Mat
              and said,{" "}
              <span className="italic">
                “This is the exact spot where you asked me to be your
                girlfriend.”
              </span>{" "}
              In that instant, he gently took both of my hands, and I
              immediately knew. He was proposing. My heart raced, time stood
              still, and in that perfect moment, nothing else mattered.
            </p>
          </div>
          <div className="md:order-1 flex justify-center">
            <Image
              src="https://q8a0jhjw1u.ufs.sh/f/3POoQHRcbaUORJSHeavG80gS6BkbOVwITDxorXjumJAtLCFe"
              alt="The Proposal"
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

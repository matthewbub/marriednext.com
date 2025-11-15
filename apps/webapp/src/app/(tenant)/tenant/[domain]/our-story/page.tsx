import Image from "next/image";
import Link from "next/link";
import { getWeddingByDomain } from "@/lib/tenant/getWeddingByDomain";
import { notFound } from "next/navigation";
import { OurStorySection } from "@/lib/tenant/weddingData.types";
import clsx from "clsx";

type PageProps = {
  params: Promise<{ domain: string }>;
};

export default async function OurStory({ params }: PageProps) {
  const { domain } = await params;
  const weddingData = await getWeddingByDomain(domain);

  if (!weddingData) {
    notFound();
  }

  const ourStory = weddingData.fieldOurStory as OurStorySection[] | null;

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          Our Story
        </h1>

        {ourStory && ourStory.length > 0 ? (
          <>
            {ourStory.map((section, index) => (
              <div
                key={section.id}
                className={clsx(
                  "grid md:grid-cols-2 gap-12 items-center mb-16",
                  index % 2 === 1 && "md:grid-flow-dense"
                )}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <h2 className="text-3xl mb-6">{section.heading}</h2>
                  <p className="text-lg leading-relaxed mb-4">
                    {section.text}
                  </p>
                </div>
                {section.photoUrl && (
                  <div
                    className={clsx(
                      "flex justify-center",
                      index % 2 === 1 && "md:order-1"
                    )}
                  >
                    <Image
                      src={section.photoUrl}
                      alt={section.heading}
                      width={400}
                      height={500}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="text-center text-gray-500 mb-16">
            <p>Our story will be shared soon!</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

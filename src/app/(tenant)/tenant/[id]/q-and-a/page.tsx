import Link from "next/link";
import { getLocale } from "@/lib/tenant/locales/en-US";

export default function QAndA() {
  const t = getLocale();

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          {t.pages.qAndA.title}
        </h1>

        <div className="text-center mb-16">
          <p className="text-xl leading-relaxed max-w-2xl mx-auto">
            {t.pages.qAndA.intro}
          </p>
        </div>

        <div className="space-y-8 mb-20">
          {t.pages.qAndA.faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-300 pb-6">
              <h3 className="text-2xl font-semibold mb-4">{faq.question}</h3>

              {faq.answer && (
                <p className="text-lg leading-relaxed text-gray-700">
                  {faq.answer}
                </p>
              )}

              {faq?.html && (
                <p
                  className="text-lg leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ __html: faq.html }}
                />
              )}
            </div>
          ))}
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

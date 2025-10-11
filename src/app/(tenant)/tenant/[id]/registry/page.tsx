import { getLocale } from "@/lib/tenant/locales/en-US";
import { paymentLinks } from "@/lib/tenant/constants";

export default function Registry() {
  const t = getLocale();
  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-6xl mb-16 uppercase text-center mt-20">
          {t.pages.registry.title}
        </h1>

        <section className="mx-auto max-w-xl text-center">
          <p className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed text-center">
            Your presence at our wedding is the greatest gift of all. If you’d
            like to help us celebrate, we’ve created a honeymoon fund to make
            our first adventure as a married couple extra special.
          </p>

          {/* Donation Options */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {([25, 50, 100, 250, 500] as const).map((amount) => {
              const href = (paymentLinks as Record<string, string>)[
                String(amount)
              ];
              return (
                <a
                  key={amount}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition text-lg font-medium"
                >
                  ${amount}
                </a>
              );
            })}

            {/* Custom Option */}
            <a
              href={paymentLinks.custom}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition text-lg font-medium"
            >
              Custom
            </a>
          </div>

          {/* Optional note */}
          <p className="text-sm text-gray-500">
            Every contribution helps us create memories we’ll cherish forever.
          </p>
        </section>
      </div>
    </div>
  );
}

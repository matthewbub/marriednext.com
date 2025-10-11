import { getLocale } from "@/lib/tenant/locales/en-US";

export default function Footer() {
  const t = getLocale();
  return (
    <footer className="text-center text-sm pb-10 mt-20">
      <p>
        {t.common.credits.madeBy}{" "}
        <a href="https://mattbub.com" target="_blank" className="underline">
          Matt
        </a>
      </p>
    </footer>
  );
}

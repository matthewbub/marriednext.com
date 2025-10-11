import Link from "next/link";
import { getLocale } from "@/lib/tenant/locales/en-US";
import { ComingSoonProps } from "@/lib/tenant/types";

export default function ComingSoon({
  title,
  message,
  backHref = "/",
  className = "",
}: ComingSoonProps) {
  const t = getLocale();
  const resolvedTitle = title ?? t.common.comingSoon.title;
  const resolvedMessage = message ?? t.common.comingSoon.message;
  return (
    <div className={`text-center ${className} mt-20 mb-36`}>
      <div className="mb-14">
        <h2 className="abramo-script text-6xl md:text-7xl leading-none">
          {resolvedTitle}
        </h2>
        <p className="mt-6 text-lg md:text-xl text-gray-700">
          {resolvedMessage}
        </p>
      </div>
      <Link href={backHref} className="btn-primary">
        {t.common.backToHome}
      </Link>
    </div>
  );
}

import Link from "next/link";
import { ComingSoonProps } from "@/lib/tenant/types";

export default function ComingSoon({
  title,
  message,
  backHref = "/",
  className = "",
}: ComingSoonProps) {
  const resolvedTitle = title ?? "Coming Soon";
  const resolvedMessage =
    message ??
    "We're putting the finishing touches on this section. Please check back soon.";
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
        Back to Home
      </Link>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <div className="w-full bg-white dark:bg-gray-900 py-10 px-6">
      <div className="bg-orange-800 text-white w-full rounded-lg">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            Start planning smarter today
          </h2>
          <p className="mt-6 max-w-xl text-lg/8 text-orange-100">
            Join couples who are managing their guest lists without the stress.
            Free to start, no credit card required, and built with transparency
            you can trust.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button asChild>
              <Link href="/sign-up">
                Get started free <ArrowRightIcon className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

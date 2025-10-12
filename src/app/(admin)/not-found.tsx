"use client";

import TemeculaWineBackground from "@/components/RollingHillsBackground";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <TemeculaWineBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center space-y-6">
          <h1 className="text-9xl font-bold text-white drop-shadow-lg">404</h1>
          <h2 className="text-3xl font-semibold text-white drop-shadow-md">
            Page Not Found
          </h2>
          <p className="text-xl text-white/90 drop-shadow max-w-md">
            Looks like you've drifted off course. Let's get you back home.
          </p>
          <div className="pt-4">
            <Button
              onClick={() => router.push("/")}
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

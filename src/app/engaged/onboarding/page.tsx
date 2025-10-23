"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";

export default function OnboardingPage() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [weddingDate, setWeddingDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubdomainChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSubdomain(normalized);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!subdomain || !partner1Name || !partner2Name || !weddingDate) {
      setError("Please fill in all fields");
      return;
    }

    if (subdomain.length < 3) {
      setError("Subdomain must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subdomain,
          partner1Name,
          partner2Name,
          weddingDate: weddingDate.toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      router.push("/guest-list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    subdomain && partner1Name && partner2Name && weddingDate && !isSubmitting;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome!</h1>
            <p className="text-stone-700">
              Let&apos;s set up your wedding website
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Your Wedding URL</Label>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    placeholder="sarahandjohn"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-stone-600 whitespace-nowrap">
                    .marriednext.com
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner1">Partner 1 Name</Label>
              <Input
                id="partner1"
                value={partner1Name}
                onChange={(e) => setPartner1Name(e.target.value)}
                placeholder="Sarah"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partner2">Partner 2 Name</Label>
              <Input
                id="partner2"
                value={partner2Name}
                onChange={(e) => setPartner2Name(e.target.value)}
                placeholder="John"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>Wedding Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={clsx(
                      "w-full justify-start text-left font-normal px-3",
                      !weddingDate && "text-muted-foreground"
                    )}
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {weddingDate ? (
                      format(weddingDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={weddingDate}
                    onSelect={setWeddingDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {isSubmitting ? "Creating your site..." : "Get Started"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

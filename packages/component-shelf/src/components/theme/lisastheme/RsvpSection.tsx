"use client";

import "style-shelf/tailwind-hybrid";
import type React from "react";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ArrowRight, Check } from "lucide-react";

interface RsvpSectionProps {
  rsvpFormComponent?: React.ReactNode;
}

export function RsvpSection({ rsvpFormComponent }: RsvpSectionProps) {
  const [step, setStep] = useState<"search" | "found" | "confirmed">("search");
  const [firstName, setFirstName] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim()) {
      setStep("found");
    }
  };

  const handleConfirm = () => {
    setStep("confirmed");
  };

  if (rsvpFormComponent) {
    return (
      <section
        id="rsvp"
        className="py-32 bg-[#faf9f6] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#745656]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#745656]/5 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="max-w-xl mx-auto px-6 text-center relative z-10">
          <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
            We Hope You Can Join Us
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic mb-4">
            RSVP
          </h2>
          <div className="mt-12">{rsvpFormComponent}</div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-32 bg-[#faf9f6] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#745656]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#745656]/5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="max-w-xl mx-auto px-6 text-center relative z-10">
        <p className="text-[#745656] tracking-[0.4em] uppercase text-sm mb-4">
          We Hope You Can Join Us
        </p>
        <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] font-light italic mb-4">
          RSVP
        </h2>
        <p className="text-[#2c2c2c]/70 mb-12">
          Please respond by March 15, 2026
        </p>

        {step === "search" && (
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-14 text-lg text-center bg-transparent border-0 border-b-2 border-[#745656]/30 rounded-none focus:border-[#745656] focus:ring-0 placeholder:text-[#2c2c2c]/40"
              />
            </div>
            <Button
              type="submit"
              className="h-14 px-12 bg-[#745656] hover:bg-[#5d4545] text-white tracking-[0.2em] uppercase text-sm"
            >
              Find My Invitation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {step === "found" && (
          <div className="space-y-8">
            <div className="py-8 border-y border-[#745656]/20">
              <p className="text-[#2c2c2c]/60 text-sm tracking-[0.2em] uppercase mb-2">
                Invitation for
              </p>
              <p className="font-serif text-3xl text-[#2c2c2c] italic">
                {firstName} & Guest
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-[#2c2c2c]/70">Will you be joining us?</p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={handleConfirm}
                  className="h-14 px-10 bg-[#745656] hover:bg-[#5d4545] text-white tracking-[0.2em] uppercase text-sm"
                >
                  Joyfully Accept
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-10 border-[#745656]/30 text-[#2c2c2c] hover:bg-[#745656]/5 tracking-[0.2em] uppercase text-sm bg-transparent"
                >
                  Regretfully Decline
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "confirmed" && (
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#745656]/10">
              <Check className="w-10 h-10 text-[#745656]" />
            </div>
            <div>
              <h3 className="font-serif text-3xl text-[#2c2c2c] italic mb-2">
                Thank You, {firstName}!
              </h3>
              <p className="text-[#2c2c2c]/70">
                We can't wait to celebrate with you. Check your email for
                confirmation details.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

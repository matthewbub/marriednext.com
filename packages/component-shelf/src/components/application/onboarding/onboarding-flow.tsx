"use client";

import { useAppSelector } from "../../../lib/store/hooks";
import { Step1CoupleNames } from "./step-1-couple-names";
import { Step2WeddingDetails } from "./step-2-wedding-details";
import { Step3VenueInfo, type OnboardingFormData } from "./step-3-venue-info";
import { OnboardingComplete } from "./onboarding-complete";
import { Calendar, MapPin, Check, Heart } from "lucide-react";
import { MarriedNextLogo } from "../../ui/married-next-logo";
import type { ComponentPropsWithoutRef } from "react";

const steps = [
  { number: 1, label: "Names", icon: Heart },
  { number: 2, label: "Details", icon: Calendar },
  { number: 3, label: "Venue", icon: MapPin },
];

export type OnboardingFlowProps = {
  link: React.ComponentType<ComponentPropsWithoutRef<"a">>;
  onSubmit?: (data: OnboardingFormData) => void | Promise<void>;
  onSkip?: (data: OnboardingFormData) => void | Promise<void>;
  onSubdomainBlur?: (
    subdomain: string
  ) => Promise<{ available: boolean; error?: string }>;
};

export function OnboardingFlow({
  link: Link,
  onSubmit,
  onSkip,
  onSubdomainBlur,
}: OnboardingFlowProps) {
  const { currentStep, isComplete } = useAppSelector(
    (state) => state.onboarding
  );

  if (isComplete) {
    return <OnboardingComplete link={Link} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <MarriedNextLogo className="h-6 w-6" />
            <span className="font-serif text-xl font-semibold text-foreground">
              Married Next
            </span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 bg-card/50 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div
                    key={step.number}
                    className="flex items-center flex-1 last:flex-none"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                          ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }
                          ${
                            isActive
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : ""
                          }
                          ${
                            !isActive && !isCompleted
                              ? "bg-muted text-muted-foreground"
                              : ""
                          }
                        `}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon
                            className={`w-5 h-5 ${
                              isActive ? "fill-primary-foreground" : ""
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`
                          mt-2 text-sm font-medium transition-colors
                          ${
                            isActive || isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        {step.label}
                      </span>
                    </div>
                    {/* Connecting line */}
                    {index < steps.length - 1 && (
                      <div className="flex-1 mx-4 h-0.5 relative top-[-12px]">
                        <div className="absolute inset-0 bg-muted rounded-full" />
                        <div
                          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
                          style={{ width: isCompleted ? "100%" : "0%" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && <Step1CoupleNames />}
          {currentStep === 2 && (
            <Step2WeddingDetails onSubdomainBlur={onSubdomainBlur} />
          )}
          {currentStep === 3 && (
            <Step3VenueInfo onSubmit={onSubmit} onSkip={onSkip} />
          )}
        </div>
      </main>
    </div>
  );
}

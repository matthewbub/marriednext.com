"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import clsx from "clsx";
import { useRsvpStore } from "@/stores/rsvpStore";

interface RsvpFormProps {
  className?: string;
  variant?: "tenant" | "legacy";
  onLookup: (name: string) => void;
  onSubmit: () => void;
}

export default function RsvpForm({
  className,
  variant = "tenant",
  onLookup,
  onSubmit,
}: RsvpFormProps) {
  const {
    step,
    invitation,
    selectedGuests,
    email,
    nameFormat,
    isLoading,
    errorMessage,
    setStep,
    toggleGuest,
    setEmail,
    reset,
  } = useRsvpStore();

  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    formState: { errors: nameErrors },
  } = useForm<{ name: string }>();

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    setValue: setEmailValue,
  } = useForm<{ email: string }>({
    defaultValues: { email },
  });

  useEffect(() => {
    if (email) {
      setEmailValue("email", email);
    }
  }, [email, setEmailValue]);

  const isLegacy = variant === "legacy";

  const handleNameSubmit = (data: { name: string }) => {
    onLookup(data.name);
  };

  const handleGuestSelectionNext = () => {
    setStep("email-collection");
  };

  const handleEmailSubmit = (data: { email: string }) => {
    setEmail(data.email);
    onSubmit();
  };

  const baseStyles = clsx(
    "w-full flex flex-col items-center justify-center px-4 pb-12",
    className
  );

  const containerStyles = clsx("max-w-3xl w-full text-center");

  const titleStyles = clsx(
    isLegacy
      ? "text-5xl md:text-6xl mt-6 md:mt-10"
      : "text-5xl md:text-6xl mt-6 md:mt-10"
  );

  const buttonStyles = clsx(
    "inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  );

  const inputStyles = clsx(
    "w-full bg-white text-2xl md:text-4xl py-5 md:py-7 px-6 md:px-8 border border-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10 leading-7 md:leading-10"
  );

  const getPlaceholder = () => {
    if (nameFormat === "FIRST_NAME_ONLY") {
      return "First Name";
    }
    return "Full Name";
  };

  const attendingCount = selectedGuests.filter((g) => g.isAttending).length;
  const totalGuests = selectedGuests.length;

  return (
    <div className={baseStyles}>
      <div className={containerStyles}>
        <h2 className={titleStyles}>RSVP</h2>

        {step === "name-input" && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Please enter{" "}
              {nameFormat === "FIRST_NAME_ONLY"
                ? "your first name"
                : "your full name"}{" "}
              as it appears on your invitation.
            </p>

            <form
              noValidate
              onSubmit={handleSubmitName(handleNameSubmit)}
              className="mt-10 md:mt-12"
            >
              <label htmlFor="name" className="sr-only">
                {getPlaceholder()}
              </label>
              <input
                id="name"
                type="text"
                inputMode="text"
                autoComplete="name"
                placeholder={getPlaceholder()}
                aria-invalid={nameErrors.name ? "true" : "false"}
                className={inputStyles}
                disabled={isLoading}
                {...registerName("name", {
                  required: `Your ${
                    nameFormat === "FIRST_NAME_ONLY"
                      ? "first name"
                      : "full name"
                  } is required`,
                })}
              />
              {nameErrors.name && (
                <div
                  role="alert"
                  className="text-left text-red-700 mt-2 text-sm md:text-base"
                >
                  {nameErrors.name.message}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={buttonStyles}
                >
                  <span className="text-lg md:text-xl">
                    {isLoading ? "Checking..." : "Continue"}
                  </span>
                </button>
              </div>
            </form>
          </>
        )}

        {step === "guest-selection" && invitation && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Great! We found your invitation.
            </p>
            <p className="mt-2 text-base md:text-lg text-gray-600">
              Please select who will be attending:
            </p>

            <div className="mt-8 md:mt-10 space-y-3 w-md mx-auto">
              {selectedGuests.map((guest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-white border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  <Label
                    htmlFor={`guest-${index}`}
                    className="text-lg md:text-xl font-medium cursor-pointer flex-1 text-left"
                  >
                    {guest.name}
                  </Label>
                  <Checkbox
                    id={`guest-${index}`}
                    checked={guest.isAttending}
                    onCheckedChange={() => toggleGuest(guest.name)}
                    className="h-6 w-6"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm md:text-base text-gray-600">
              {attendingCount === 0 && (
                <p>
                  No guests selected. Please select at least one guest or mark
                  as not attending.
                </p>
              )}
              {attendingCount > 0 && (
                <p>
                  {attendingCount} of {totalGuests}{" "}
                  {totalGuests === 1 ? "guest" : "guests"} attending
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setStep("name-input")}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-800 underline text-base md:text-lg"
              >
                ← Back
              </button>
              <button
                onClick={handleGuestSelectionNext}
                disabled={isLoading}
                className={buttonStyles}
              >
                <span className="text-lg md:text-xl">Continue</span>
              </button>
            </div>
          </>
        )}

        {step === "email-collection" && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Almost done! We just need your email.
            </p>
            <p className="mt-2 text-sm md:text-base text-gray-600">
              This will only be used to send you updates about the wedding.
            </p>

            <form
              noValidate
              onSubmit={handleSubmitEmail(handleEmailSubmit)}
              className="mt-10 md:mt-12"
            >
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Email Address"
                aria-invalid={emailErrors.email ? "true" : "false"}
                className={inputStyles}
                disabled={isLoading}
                {...registerEmail("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
              />
              {emailErrors.email && (
                <div
                  role="alert"
                  className="text-left text-red-700 mt-2 text-sm md:text-base"
                >
                  {emailErrors.email.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("guest-selection")}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-gray-800 underline text-base md:text-lg"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={buttonStyles}
                >
                  <span className="text-lg md:text-xl">
                    {isLoading ? "Submitting..." : "Submit RSVP"}
                  </span>
                </button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <>
            <div
              aria-live="polite"
              className="mt-6 md:mt-10 text-green-800 text-lg md:text-xl"
            >
              Thank you! Your RSVP has been submitted successfully.
              {attendingCount > 0 && (
                <span className="block mt-2">
                  We can't wait to see you there! ✨
                </span>
              )}
              {attendingCount === 0 && (
                <span className="block mt-2">We'll miss you! 💝</span>
              )}
            </div>
            <button onClick={reset} className={clsx(buttonStyles, "mt-6")}>
              <span className="text-lg md:text-xl">RSVP Another Guest</span>
            </button>
          </>
        )}

        {step === "error" && (
          <>
            <div
              role="alert"
              className="mt-6 md:mt-10 text-red-800 text-lg md:text-xl"
            >
              {errorMessage || "Something went wrong. Please try again."}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <button onClick={reset} className={buttonStyles}>
                <span className="text-lg md:text-xl">Try Again</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

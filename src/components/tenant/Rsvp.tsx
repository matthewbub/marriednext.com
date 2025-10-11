"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { validateGuest, getCompanionName } from "@/lib/tenant/guestList";
import {
  transition,
  submitName,
  type RsvpState as FlowState,
} from "@/lib/tenant/rsvpFlow";

type FormValues = {
  firstName: string;
};

export default function Rsvp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [rsvpState, setRsvpState] = useState<FlowState>({ step: "name-input" });
  const [isLoading, setIsLoading] = useState(false);

  const FRIENDLY_ERROR_MESSAGE =
    "Sorry, something went wrong saving your RSVP. Please try again, or reach out to the bride and groom if you need help.";

  async function postRsvp(
    nameOnInvitation: string,
    isAttending: boolean,
    hasPlusOne?: boolean
  ) {
    const body: {
      nameOnInvitation: string;
      isAttending: boolean;
      hasPlusOne?: boolean;
    } = {
      nameOnInvitation,
      isAttending,
    };
    if (typeof hasPlusOne !== "undefined") {
      body.hasPlusOne = hasPlusOne;
    }
    const response = await fetch("/api/v2/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to save RSVP");
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      const next = await submitName(rsvpState, data.firstName, (name) => ({
        guestType: validateGuest(name),
        companionName: getCompanionName(name),
      }));
      setRsvpState(next);
    } catch {
      setRsvpState({
        step: "error",
        message:
          "Sorry, we couldn't look up your name right now. Please try again, or reach out to the bride and groom if you need help.",
      });
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  const handleAttendanceResponse = async (canAttend: boolean) => {
    if (rsvpState.step !== "attendance-question") return;
    setIsLoading(true);
    try {
      // Save immediately for "No" responses
      if (!canAttend) {
        await postRsvp(rsvpState.name, false);
        setRsvpState((prev) =>
          transition(prev, { type: "AttendanceAnswered", canAttend })
        );
        return;
      }

      // If attending, save immediately for GUEST_ONLY, otherwise continue flow
      if (rsvpState.guestType === "GUEST_ONLY") {
        await postRsvp(rsvpState.name, true);
        setRsvpState((prev) =>
          transition(prev, { type: "AttendanceAnswered", canAttend })
        );
        return;
      }

      // For plus-one scenarios, advance to the next question without saving yet
      setRsvpState((prev) =>
        transition(prev, { type: "AttendanceAnswered", canAttend })
      );
    } catch {
      setRsvpState({ step: "error", message: FRIENDLY_ERROR_MESSAGE });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlusOneResponse = async (hasPlusOne: boolean) => {
    if (rsvpState.step !== "plus-one-question") return;
    setIsLoading(true);
    try {
      await postRsvp(rsvpState.name, true, hasPlusOne);
      setRsvpState((prev) =>
        transition(prev, { type: "PlusOneAnswered", hasPlusOne })
      );
    } catch {
      setRsvpState({ step: "error", message: FRIENDLY_ERROR_MESSAGE });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKnownCompanionResponse = async (companionAttending: boolean) => {
    if (rsvpState.step !== "known-companion-question") return;
    setIsLoading(true);
    try {
      await postRsvp(rsvpState.name, true, companionAttending);
      setRsvpState((prev) =>
        transition(prev, { type: "KnownCompanionAnswered", companionAttending })
      );
    } catch {
      setRsvpState({ step: "error", message: FRIENDLY_ERROR_MESSAGE });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setRsvpState((prev) => transition(prev, { type: "Reset" }));
    reset();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full text-center">
        <h2 className="text-5xl md:text-6xl mt-6 md:mt-10">RSVP</h2>

        {/* Step 1: Name Input */}
        {rsvpState.step === "name-input" && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Please enter your first name and we'll find you on the list.
            </p>

            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="mt-10 md:mt-12"
            >
              <label htmlFor="firstName" className="sr-only">
                First name only
              </label>
              <input
                id="firstName"
                type="text"
                inputMode="text"
                autoComplete="given-name"
                placeholder="First Name"
                aria-invalid={errors.firstName ? "true" : "false"}
                className="w-full bg-white text-2xl md:text-4xl py-5 md:py-7 px-6 md:px-8 border border-gray-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-black/10 leading-7 md:leading-10"
                {...register("firstName", {
                  required: "Your first name is required",
                })}
              />
              {errors.firstName && (
                <div
                  role="alert"
                  className="text-left text-red-700 mt-2 text-sm md:text-base"
                >
                  {errors.firstName.message}
                </div>
              )}

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg md:text-xl">
                    {isLoading ? "Checking..." : "Continue"}
                  </span>
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 2: Attendance Question */}
        {rsvpState.step === "attendance-question" && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Great! We found you on the list, {rsvpState.name}.
            </p>
            <p className="mt-2 text-lg md:text-xl text-gray-700">
              Can you attend?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12">
              <button
                onClick={() => handleAttendanceResponse(true)}
                disabled={isLoading}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg md:text-xl">Yes, I can attend</span>
              </button>
              <button
                onClick={() => handleAttendanceResponse(false)}
                disabled={isLoading}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg md:text-xl">No, I can't make it</span>
              </button>
            </div>

            <button
              onClick={() =>
                setRsvpState((prev) => transition(prev, { type: "Back" }))
              }
              disabled={isLoading}
              className="mt-6 text-gray-600 hover:text-gray-800 underline text-base md:text-lg"
            >
              ← Back
            </button>
          </>
        )}

        {/* Step 3: Plus One Question */}
        {rsvpState.step === "plus-one-question" && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Great! We found you on the list, {rsvpState.name}.
            </p>
            <p className="mt-2 text-xl md:text-xl text-gray-700 animate-pulse">
              Are you bringing a plus one?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12">
              <button
                onClick={() => handlePlusOneResponse(true)}
                disabled={isLoading}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg md:text-xl">
                  Yes, I'm bringing someone
                </span>
              </button>
              <button
                onClick={() => handlePlusOneResponse(false)}
                disabled={isLoading}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg md:text-xl">No, just me</span>
              </button>
            </div>

            <button
              onClick={() =>
                setRsvpState((prev) => transition(prev, { type: "Back" }))
              }
              disabled={isLoading}
              className="mt-6 text-gray-600 hover:text-gray-800 underline text-base md:text-lg"
            >
              ← Back
            </button>
          </>
        )}

        {/* Step 3b: Known Companion Question */}
        {rsvpState.step === "known-companion-question" && (
          <>
            <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700">
              Great! We found you on the list, {rsvpState.name}.
            </p>
            <p className="mt-2 text-xl md:text-xl text-gray-700 animate-pulse">
              Will {rsvpState.companionName} be attending with you?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 md:mt-12">
              <button
                onClick={() => handleKnownCompanionResponse(true)}
                disabled={isLoading}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg md:text-xl">Yes</span>
              </button>
              <button
                onClick={() => handleKnownCompanionResponse(false)}
                disabled={isLoading}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg md:text-xl">No</span>
              </button>
            </div>

            <button
              onClick={() =>
                setRsvpState((prev) => transition(prev, { type: "Back" }))
              }
              disabled={isLoading}
              className="mt-6 text-gray-600 hover:text-gray-800 underline text-base md:text-lg"
            >
              ← Back
            </button>
          </>
        )}

        {/* Step 4: Success Message */}
        {rsvpState.step === "success" && (
          <>
            <div
              aria-live="polite"
              className="mt-6 md:mt-10 text-green-800 text-lg md:text-xl"
            >
              {rsvpState.message}
            </div>
            <button
              onClick={resetForm}
              className="mt-6 inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
            >
              <span className="text-lg md:text-xl">RSVP Another Guest</span>
            </button>
          </>
        )}

        {/* Error State */}
        {rsvpState.step === "error" && (
          <>
            <div
              role="alert"
              className="mt-6 md:mt-10 text-red-800 text-lg md:text-xl"
            >
              {rsvpState.message}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <button
                onClick={resetForm}
                className="w-full sm:w-auto inline-block border-2 border-black px-8 py-3 uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
              >
                <span className="text-lg md:text-xl">Try Again</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

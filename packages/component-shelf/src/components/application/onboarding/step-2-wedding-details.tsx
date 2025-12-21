"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../lib/store/hooks";
import {
  nextStep,
  prevStep,
  updateFormData,
} from "../../../lib/store/onboarding-slice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Calendar,
  Clock,
  Globe,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type Step2FormData = {
  subdomain: string;
  fieldEventDate: string;
  fieldEventTime: string;
};

type SubdomainStatus = "idle" | "checking" | "valid" | "invalid";

type Step2Props = {
  onSubdomainBlur?: (
    subdomain: string
  ) => Promise<{ available: boolean; error?: string }>;
};

export function Step2WeddingDetails({ onSubdomainBlur }: Step2Props) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.onboarding.formData);
  const [subdomainStatus, setSubdomainStatus] =
    useState<SubdomainStatus>("idle");
  const [subdomainError, setSubdomainError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Step2FormData>({
    defaultValues: {
      subdomain: formData.subdomain,
      fieldEventDate: formData.fieldEventDate,
      fieldEventTime: formData.fieldEventTime,
    },
  });

  const subdomain = watch("subdomain");

  const onSubmit = async (data: Step2FormData) => {
    setIsSubmitting(true);

    if (subdomainStatus === "invalid") {
      setError("subdomain", {
        message: subdomainError || "Please choose a different URL",
      });
      setIsSubmitting(false);
      return;
    }

    if (data.subdomain.length < 3) {
      setError("subdomain", {
        message: "Must be at least 3 characters",
      });
      setIsSubmitting(false);
      return;
    }

    dispatch(updateFormData(data));
    dispatch(nextStep());
    setIsSubmitting(false);
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    e.target.value = formatted;
    clearErrors("subdomain");
    setSubdomainStatus("idle");
    setSubdomainError(null);
  };

  const handleSubdomainBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value || value.length < 3) {
      setSubdomainStatus("idle");
      setSubdomainError(null);
      return;
    }

    if (!onSubdomainBlur) {
      return;
    }

    setSubdomainStatus("checking");
    setSubdomainError(null);

    try {
      const result = await onSubdomainBlur(value);

      if (result.available) {
        setSubdomainStatus("valid");
        setSubdomainError(null);
      } else {
        setSubdomainStatus("invalid");
        setSubdomainError(result.error || "This URL is not available");
      }
    } catch {
      setSubdomainStatus("invalid");
      setSubdomainError("Unable to verify availability. Please try again.");
    }
  };

  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Calendar className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="font-serif text-3xl font-semibold">
          Wedding Details
        </CardTitle>
        <CardDescription className="text-base">
          Tell us about your special day
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subdomain" className="text-base">
                Your Website URL <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="subdomain"
                    {...register("subdomain", {
                      required: "Website URL is required",
                      minLength: {
                        value: 3,
                        message: "Must be at least 3 characters",
                      },
                    })}
                    placeholder="your-names"
                    className={`h-12 text-base pl-10 pr-10 ${
                      subdomainStatus === "valid"
                        ? "border-green-500 focus-visible:ring-green-500"
                        : subdomainStatus === "invalid"
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    onChange={handleSubdomainChange}
                    onBlur={handleSubdomainBlur}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {subdomainStatus === "checking" && (
                      <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
                    )}
                    {subdomainStatus === "valid" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {subdomainStatus === "invalid" && (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
                <span className="text-muted-foreground whitespace-nowrap text-sm">
                  .marriednext.com
                </span>
              </div>

              <div className="space-y-1">
                {subdomain && subdomain.length >= 3 && (
                  <p className="text-xs text-muted-foreground">
                    Your site will be:{" "}
                    <span
                      className={
                        subdomainStatus === "valid"
                          ? "text-green-600 font-medium"
                          : "text-primary"
                      }
                    >
                      {subdomain}.marriednext.com
                    </span>
                  </p>
                )}
                {subdomainStatus === "valid" && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    This URL is available!
                  </p>
                )}
                {subdomainError && (
                  <p className="text-sm text-destructive">{subdomainError}</p>
                )}
                {errors.subdomain && !subdomainError && (
                  <p className="text-sm text-destructive">
                    {errors.subdomain.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-6 pb-2">
              <div className="flex items-center gap-3 justify-center">
                <div className="h-px flex-1 bg-border" />
                <p className="text-sm text-muted-foreground px-2">
                  Already have the date locked in?
                </p>
                <div className="h-px flex-1 bg-border" />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                You can always update this later in settings
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fieldEventDate" className="text-base">
                  Wedding Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fieldEventDate"
                    type="date"
                    {...register("fieldEventDate")}
                    className="h-12 text-base pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldEventTime" className="text-base">
                  Ceremony Time
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="fieldEventTime"
                    type="time"
                    {...register("fieldEventTime")}
                    className="h-12 text-base pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="gap-2 bg-transparent"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              size="lg"
              className="gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../lib/store/hooks";
import {
  prevStep,
  updateFormData,
  completeOnboarding,
  type OnboardingState,
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
import { MapPin, ArrowLeft, Check, Loader2 } from "lucide-react";

export type Step3FormData = {
  fieldLocationName: string;
  fieldPreferredLocationAddressLine1: string;
  fieldPreferredLocationAddressLine2: string;
  fieldPreferredLocationCity: string;
  fieldPreferredLocationState: string;
  fieldPreferredLocationZipCode: string;
  fieldPreferredLocationCountry: string;
};

export type OnboardingFormData = OnboardingState["formData"];

export type Step3VenueInfoProps = {
  onSubmit?: (data: OnboardingFormData) => void | Promise<void>;
  onSkip?: (data: OnboardingFormData) => void | Promise<void>;
};

export function Step3VenueInfo({ onSubmit, onSkip }: Step3VenueInfoProps) {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.onboarding.formData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<Step3FormData>({
    defaultValues: {
      fieldLocationName: formData.fieldLocationName,
      fieldPreferredLocationAddressLine1:
        formData.fieldPreferredLocationAddressLine1,
      fieldPreferredLocationAddressLine2:
        formData.fieldPreferredLocationAddressLine2,
      fieldPreferredLocationCity: formData.fieldPreferredLocationCity,
      fieldPreferredLocationState: formData.fieldPreferredLocationState,
      fieldPreferredLocationZipCode: formData.fieldPreferredLocationZipCode,
      fieldPreferredLocationCountry: formData.fieldPreferredLocationCountry,
    },
  });

  const handleFormSubmit = async (data: Step3FormData) => {
    setIsSubmitting(true);
    dispatch(updateFormData(data));
    const completeFormData = { ...formData, ...data };
    await onSubmit?.(completeFormData);
    dispatch(completeOnboarding());
    setIsSubmitting(false);
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    await onSkip?.(formData);
    dispatch(completeOnboarding());
    setIsSubmitting(false);
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <MapPin className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="font-serif text-3xl font-semibold">
          Venue Information
        </CardTitle>
        <CardDescription className="text-base">
          Know where your wedding will be? Add it below (you can always update
          this later)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldLocationName" className="text-base">
                Venue Name
              </Label>
              <Input
                id="fieldLocationName"
                {...register("fieldLocationName")}
                placeholder="e.g., Garden Estate"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fieldPreferredLocationAddressLine1"
                className="text-base"
              >
                Address Line 1
              </Label>
              <Input
                id="fieldPreferredLocationAddressLine1"
                {...register("fieldPreferredLocationAddressLine1")}
                placeholder="123 Main Street"
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fieldPreferredLocationAddressLine2"
                className="text-base"
              >
                Address Line 2
              </Label>
              <Input
                id="fieldPreferredLocationAddressLine2"
                {...register("fieldPreferredLocationAddressLine2")}
                placeholder="Suite, unit, building (optional)"
                className="h-12 text-base"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fieldPreferredLocationCity"
                  className="text-base"
                >
                  City
                </Label>
                <Input
                  id="fieldPreferredLocationCity"
                  {...register("fieldPreferredLocationCity")}
                  placeholder="City"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fieldPreferredLocationState"
                  className="text-base"
                >
                  State / Province
                </Label>
                <Input
                  id="fieldPreferredLocationState"
                  {...register("fieldPreferredLocationState")}
                  placeholder="State"
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fieldPreferredLocationZipCode"
                  className="text-base"
                >
                  ZIP / Postal Code
                </Label>
                <Input
                  id="fieldPreferredLocationZipCode"
                  {...register("fieldPreferredLocationZipCode")}
                  placeholder="12345"
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fieldPreferredLocationCountry"
                  className="text-base"
                >
                  Country
                </Label>
                <Input
                  id="fieldPreferredLocationCountry"
                  {...register("fieldPreferredLocationCountry")}
                  placeholder="United States"
                  className="h-12 text-base"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              I don't have a location picked yet — skip this step
            </button>
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
                  Creating Your Wedding...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

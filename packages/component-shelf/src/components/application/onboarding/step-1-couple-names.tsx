"use client";

import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../lib/store/hooks";
import { nextStep, updateFormData } from "../../../lib/store/onboarding-slice";
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
import { Heart, ArrowRight } from "lucide-react";

type Step1FormData = {
  fieldNameA: string;
  fieldNameB: string;
};

export function Step1CoupleNames() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.onboarding.formData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1FormData>({
    defaultValues: {
      fieldNameA: formData.fieldNameA,
      fieldNameB: formData.fieldNameB,
    },
  });

  const onSubmit = (data: Step1FormData) => {
    dispatch(updateFormData(data));
    dispatch(nextStep());
  };

  return (
    <Card className="border-border/50 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center shadow-lg">
          <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
        </div>
        <CardTitle className="font-serif text-3xl font-semibold">
          Welcome to Married Next
        </CardTitle>
        <CardDescription className="text-base">
          Just a few details to help get you started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fieldNameA" className="text-base">
                Partner 1 Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fieldNameA"
                {...register("fieldNameA", {
                  required: "Partner 1 name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="Enter a name"
                className="h-12 text-base"
              />
              {errors.fieldNameA && (
                <p className="text-sm text-destructive">
                  {errors.fieldNameA.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldNameB" className="text-base">
                Partner 2 Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fieldNameB"
                {...register("fieldNameB", {
                  required: "Partner 2 name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                placeholder="Enter a name"
                className="h-12 text-base"
              />
              {errors.fieldNameB && (
                <p className="text-sm text-destructive">
                  {errors.fieldNameB.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

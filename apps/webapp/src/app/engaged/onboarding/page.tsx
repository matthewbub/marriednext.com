"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowRightIcon, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import clsx from "clsx";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { EngagedShell } from "component-shelf";

const SUBDOMAIN_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const onboardingSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be at most 63 characters")
    .regex(
      SUBDOMAIN_REGEX,
      "Subdomain can only contain lowercase letters, numbers, and hyphens"
    ),
  partner1Name: z.string().min(1, "Partner 1 name is required"),
  partner2Name: z.string().min(1, "Partner 2 name is required"),
  weddingDate: z.date({ message: "Wedding date is required" }),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const { data: invitationData, isLoading: isCheckingInvitation } = useQuery({
    queryKey: ["onboarding-invitation"],
    queryFn: async () => {
      const res = await fetch("/api/onboarding");
      if (!res.ok) {
        throw new Error("Failed to check invitation status");
      }
      return res.json() as Promise<{
        hasInvitation: boolean;
        invitation: {
          id: string;
          weddingId: string;
          role: string;
          invitedByName: string;
          sentAt: string;
        } | null;
      }>;
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange",
    defaultValues: {
      subdomain: "",
      partner1Name: "",
      partner2Name: "",
    },
  });

  const weddingDate = watch("weddingDate");

  const acceptInvitationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/onboarding", {
        method: "PUT",
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to accept invitation");
      }

      return responseData;
    },
    onSuccess: () => {
      router.push("/engaged/permissions");
    },
    onError: (error: Error) => {
      setApiError(error.message);
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subdomain: data.subdomain,
          partner1Name: data.partner1Name,
          partner2Name: data.partner2Name,
          weddingDate: data.weddingDate.toISOString(),
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Failed to complete onboarding");
      }

      return responseData;
    },
    onSuccess: () => {
      router.push("/engaged/guest-list");
    },
    onError: (error: Error) => {
      setApiError(error.message);
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    setApiError(null);
    onboardingMutation.mutate(data);
  };

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setValue("subdomain", normalized, { shouldValidate: true });
    setApiError(null);
  };

  return (
    <EngagedShell userButton={<UserButton />}>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="p-8 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg">
            {isCheckingInvitation ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-stone-600">Checking invitation status...</p>
              </div>
            ) : invitationData?.hasInvitation ? (
              <div className="space-y-4">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">
                    You&apos;re Invited!
                  </h1>
                  <p className="text-stone-700">
                    {invitationData.invitation?.invitedByName} has invited you
                    to collaborate on their wedding website
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Role:</strong> {invitationData.invitation?.role}
                  </p>
                </div>

                {apiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{apiError}</p>
                  </div>
                )}

                <Button
                  onClick={() => {
                    setApiError(null);
                    acceptInvitationMutation.mutate();
                  }}
                  disabled={acceptInvitationMutation.isPending}
                >
                  {acceptInvitationMutation.isPending
                    ? "Accepting..."
                    : "Accept Invitation"}{" "}
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">Welcome!</h1>
                  <p className="text-stone-700">
                    Let&apos;s set up your wedding website
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Your Wedding URL</Label>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Input
                          id="subdomain"
                          {...register("subdomain")}
                          onChange={handleSubdomainChange}
                          placeholder="sarahandjohn"
                          disabled={onboardingMutation.isPending}
                        />
                        <span className="text-sm text-stone-600 whitespace-nowrap">
                          .marriednext.com
                        </span>
                      </div>
                      {errors.subdomain && (
                        <p className="text-sm text-red-600">
                          {errors.subdomain.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partner1">Partner 1 Name</Label>
                    <Input
                      id="partner1"
                      {...register("partner1Name")}
                      placeholder="Sarah"
                      disabled={onboardingMutation.isPending}
                    />
                    {errors.partner1Name && (
                      <p className="text-sm text-red-600">
                        {errors.partner1Name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partner2">Partner 2 Name</Label>
                    <Input
                      id="partner2"
                      {...register("partner2Name")}
                      placeholder="John"
                      disabled={onboardingMutation.isPending}
                    />
                    {errors.partner2Name && (
                      <p className="text-sm text-red-600">
                        {errors.partner2Name.message}
                      </p>
                    )}
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
                          disabled={onboardingMutation.isPending}
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
                          onSelect={(date) =>
                            setValue("weddingDate", date!, {
                              shouldValidate: true,
                            })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.weddingDate && (
                      <p className="text-sm text-red-600">
                        {errors.weddingDate.message}
                      </p>
                    )}
                  </div>

                  {apiError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">
                        {apiError}
                        {apiError === "You already have a wedding site" && (
                          <>
                            {" "}
                            <Link
                              href="/engaged"
                              className="underline hover:text-red-700 font-medium"
                            >
                              Go to your dashboard
                            </Link>
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isValid || onboardingMutation.isPending}
                  >
                    {onboardingMutation.isPending
                      ? "Creating your site..."
                      : "Get Started"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </EngagedShell>
  );
}

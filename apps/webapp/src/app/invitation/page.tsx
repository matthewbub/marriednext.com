"use client";

import { useState, useEffect, Suspense } from "react";
import { useSignUp, useUser, useClerk } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Label } from "component-shelf/ui";
import { HeartIcon, SparklesIcon } from "lucide-react";
import clsx from "clsx";

const invitationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type InvitationFormData = z.infer<typeof invitationSchema>;

function InvitationContent() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { client } = useClerk();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("__clerk_ticket");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<InvitationFormData>({
    resolver: zodResolver(invitationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isSignedIn) {
      router.push("/v2/engaged");
    }
  }, [isSignedIn, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-rose-50 via-white to-amber-50">
        <div className="w-full max-w-md text-center">
          <div className="p-8 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-rose-500" />
            </div>
            <h1 className="text-2xl font-semibold text-stone-800 mb-3">
              No Invitation Found
            </h1>
            <p className="text-stone-600">
              This link appears to be invalid or has already been used. Please
              check your email for a valid invitation link.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: InvitationFormData) => {
    if (!isLoaded || !token) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        password: data.password,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        const currentUser = client.sessions.find(
          (s) => s.id === signUpAttempt.createdSessionId
        )?.user;

        if (currentUser) {
          await currentUser.update({
            firstName: data.firstName,
            lastName: data.lastName,
          });
        }

        const acceptResponse = await fetch(
          "/api/v2/engaged/accept-invitation",
          {
            method: "POST",
          }
        );

        if (!acceptResponse.ok) {
          console.error(
            "Failed to accept invitation:",
            await acceptResponse.text()
          );
        }

        router.push("/v2/engaged");
      } else {
        setApiError(
          "Sign up could not be completed. Please try again or contact support."
        );
        console.error(
          "Sign up incomplete:",
          JSON.stringify(signUpAttempt, null, 2)
        );
      }
    } catch (err: unknown) {
      const error = err as { errors?: Array<{ message?: string }> };
      const message =
        error.errors?.[0]?.message ||
        "An error occurred during sign up. Please try again.";
      setApiError(message);
      console.error("Sign up error:", JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center shadow-lg">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 mb-2">
              You&apos;re Invited!
            </h1>
            <p className="text-stone-600">
              Create your account to join the wedding planning
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Jane"
                  disabled={isSubmitting}
                  className={clsx(errors.firstName && "border-red-300")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Smith"
                  disabled={isSubmitting}
                  className={clsx(errors.lastName && "border-red-300")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Create a secure password"
                disabled={isSubmitting}
                className={clsx(errors.password && "border-red-300")}
              />
              {errors.password && (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="text-xs text-stone-500">
                Must be 8+ characters with uppercase, lowercase, and a number
              </p>
            </div>

            <div id="clerk-captcha" />

            {apiError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{apiError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-lg"
              disabled={!isValid || isSubmitting || !isLoaded}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Join the Celebration"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-stone-500">
            By creating an account, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function InvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-br from-rose-50 via-white to-amber-50">
          <div className="w-full max-w-md text-center">
            <div className="p-8 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
                <HeartIcon className="w-8 h-8 text-rose-500" />
              </div>
              <h1 className="text-2xl font-semibold text-stone-800 mb-3">
                Loading...
              </h1>
            </div>
          </div>
        </div>
      }
    >
      <InvitationContent />
    </Suspense>
  );
}

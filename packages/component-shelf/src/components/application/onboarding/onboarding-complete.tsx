"use client";

import { useEffect, type ComponentPropsWithoutRef } from "react";
import { useAppSelector } from "../../../lib/store/hooks";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export function OnboardingComplete({
  link: Link,
  onComplete,
}: {
  link: React.ComponentType<ComponentPropsWithoutRef<"a">>;
  onComplete?: () => void | Promise<void>;
}) {
  const formData = useAppSelector((state) => state.onboarding.formData);

  useEffect(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="w-full max-w-2xl relative z-10">
        <Card className="border-border/50 shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-4xl font-semibold text-foreground mb-3">
              You're All Set!
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Welcome, {formData.fieldNameA} and {formData.fieldNameB}! Your
              wedding website is ready to customize.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Website created</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Date saved</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary" />
                <span>Venue added</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Your wedding website
                </p>
              </div>
              <p className="text-primary font-mono text-sm">
                {formData.subdomain}.marriednext.com
              </p>
            </div>

            <Button size="lg" asChild className="gap-2">
              <Link href="/engaged">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

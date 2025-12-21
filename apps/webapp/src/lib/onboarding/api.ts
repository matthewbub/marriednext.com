import type { ApplicationOnboardingFormData } from "component-shelf";

export async function checkSubdomainAvailability(
  subdomain: string
): Promise<{ available: boolean; error?: string }> {
  const response = await fetch("/api/domains/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subdomain }),
  });

  const data = await response.json();
  return { available: data.available, error: data.error };
}

export async function createWeddingWithDomain(
  data: ApplicationOnboardingFormData
): Promise<void> {
  const domainResponse = await fetch("/api/domains", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subdomain: data.subdomain }),
  });

  const domainResult = await domainResponse.json();

  if (!domainResult.success) {
    throw new Error(domainResult.error || "Domain registration failed");
  }

  const onboardingResponse = await fetch("/api/onboarding", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const onboardingResult = await onboardingResponse.json();

  if (!onboardingResult.success) {
    throw new Error(onboardingResult.error || "Onboarding failed");
  }
}

import { z } from "zod";
import { RESERVED_SUBDOMAINS } from "@/lib/routing/multitenancy";

export const SUBDOMAIN_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const subdomainSchema = z
  .string()
  .min(3, "Subdomain must be at least 3 characters")
  .max(63, "Subdomain must be at most 63 characters")
  .regex(
    SUBDOMAIN_REGEX,
    "Subdomain can only contain lowercase letters, numbers, and hyphens"
  )
  .refine(
    (subdomain) => !RESERVED_SUBDOMAINS.includes(subdomain),
    "This subdomain is reserved and cannot be used"
  );

export async function validateSubdomain(
  subdomain: string
): Promise<{ valid: boolean; error?: string }> {
  if (subdomain.length < 3) {
    return { valid: false, error: "Subdomain must be at least 3 characters" };
  }
  if (subdomain.length > 63) {
    return { valid: false, error: "Subdomain must be at most 63 characters" };
  }
  if (!SUBDOMAIN_REGEX.test(subdomain)) {
    return {
      valid: false,
      error:
        "Subdomain can only contain lowercase letters, numbers, and hyphens",
    };
  }
  return { valid: true };
}

export function buildSiteUrl(
  subdomain: string | null,
  customDomain: string | null,
  plan: string
): string {
  const subdomainUrl = subdomain ? `https://${subdomain}.marriednext.com` : "";

  if (plan === "Free") {
    return subdomainUrl;
  }

  return customDomain || subdomainUrl;
}

export function getInitials(
  fullName: string | null,
  firstName: string | null,
  lastName: string | null
): string {
  if (fullName) {
    const parts = fullName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
  }
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return (first + last).toUpperCase() || "U";
}

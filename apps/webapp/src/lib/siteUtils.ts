export function buildSiteUrl(
  subdomain: string | null,
  customDomain: string | null,
  plan: string,
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
  lastName: string | null,
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

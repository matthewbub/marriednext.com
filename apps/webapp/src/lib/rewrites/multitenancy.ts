export const RESERVED_SUBDOMAINS = [
  "www",
  "admin",
  "api",
  "app",
  "dashboard",
  "blog",
  "docs",
  "documentation",
  "help",
  "support",
  "status",
  "staging",
  "dev",
  "test",
  "demo",
  "mail",
  "email",
  "smtp",
  "ftp",
  "cdn",
  "static",
  "assets",
  "images",
  "files",
  "uploads",
  "media",
  "auth",
  "login",
  "signup",
  "register",
  "account",
  "accounts",
  "settings",
  "billing",
  "payment",
  "payments",
  "checkout",
  "store",
  "shop",
  "marketplace",
  "forum",
  "community",
  "social",
  "news",
  "about",
  "contact",
  "legal",
  "privacy",
  "terms",
  "tos",
];

export function getHostType(hostHeader: string) {
  const hostWithoutPort = hostHeader.split(":")[0];
  const hostParts = hostWithoutPort.split(".");
  const firstLabel = hostParts[0] || "";

  const hasSubdomain =
    hostParts.length > 2 ||
    (hostParts.length > 1 && hostParts[hostParts.length - 1] === "localhost");
  const isTenantHost =
    hasSubdomain && !RESERVED_SUBDOMAINS.includes(firstLabel);

  return { isTenantHost, firstLabel };
}

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getHostType } from "@/lib/rewrites/multitenancy";
import { edgeDb } from "@/database/edge";
import { logs } from "orm-shelf/schema";

interface ClerkMetadata {
  onboardingComplete?: boolean;
  weddingId?: string;
  role?: string;
}

const isOnboardingRoute = createRouteMatcher(["/engaged/onboarding"]);
const isOnboardingApiRoute = createRouteMatcher(["/api/onboarding(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/welcome",
  "/invitation",
  "/register",
  "/sign-in",
  "/api/tenant/rsvp/(.*)",
  "/documentation",
  "/documentation/(.*)",
]);

function nextResponseRewrite(req: NextRequest, url: string) {
  return NextResponse.rewrite(new URL(url, req.url));
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth();
  const hostHeader = req.headers.get("host") || "";
  const { isTenantHost, firstLabel } = getHostType(hostHeader);

  if (!isTenantHost) {
    // if its a public route, don't force the onboarding flow
    if (isPublicRoute(req)) {
      return NextResponse.next();
    }

    // don't worry about the onboarding routes
    if (
      isAuthenticated &&
      (isOnboardingRoute(req) || isOnboardingApiRoute(req))
    ) {
      return NextResponse.next();
    }

    // if its a private route and user is not authenticated, redirect to sign in
    if (!isAuthenticated && !isPublicRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // if the user is authenticated and the onboarding is not complete, redirect to the onboarding flow
    const metadata = sessionClaims?.metadata as ClerkMetadata;

    const logData = {
      isAuthenticated,
      userId: sessionClaims?.sub,
      sessionId: sessionClaims?.sid,
      issuedAt: sessionClaims?.iat,
      expiresAt: sessionClaims?.exp,
      onboardingComplete: metadata?.onboardingComplete,
      onboardingCompleteType: typeof metadata?.onboardingComplete,
      weddingId: metadata?.weddingId,
      role: metadata?.role,
      fullMetadata: metadata,
      fullSessionClaims: sessionClaims,
      url: req.url,
    };

    console.log("[ONBOARDING DEBUG]", logData);

    edgeDb
      .insert(logs)
      .values({ info: logData })
      .catch((error) => {
        console.error("[ONBOARDING DEBUG] Failed to log to database:", error);
      });

    if (isAuthenticated && !metadata?.onboardingComplete) {
      console.log("[ONBOARDING DEBUG] Redirecting to onboarding");
      edgeDb
        .insert(logs)
        .values({
          info: { ...logData, action: "redirect_to_onboarding" },
        })
        .catch((error) => {
          console.error(
            "[ONBOARDING DEBUG] Failed to log redirect to database:",
            error
          );
        });
      const onboardingUrl = new URL("/engaged/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  } else {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api/tenant/")) {
      return NextResponse.next();
    }

    if (isTenantHost) {
      const hostWithoutPort = hostHeader.split(":")[0];
      const hostParts = hostWithoutPort.split(".");
      const isSubdomain =
        hostParts.length > 2 ||
        (hostParts.length > 1 &&
          hostParts[hostParts.length - 1] === "localhost");
      const domain = isSubdomain ? firstLabel : hostWithoutPort;

      return nextResponseRewrite(req, `/tenant/${domain}${pathname}`);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

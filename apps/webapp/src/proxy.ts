import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getHostType } from "@/lib/rewrites/multitenancy";

const isOnboardingRoute = createRouteMatcher(["/engaged/onboarding"]);
const isOnboardingApiRoute = createRouteMatcher(["/api/onboarding(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/",
  "/welcome",
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
    if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
      const onboardingUrl = new URL("/engaged/onboarding", req.url);
      return NextResponse.redirect(onboardingUrl);
    }
  } else {
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api/tenant/")) {
      return NextResponse.next();
    }

    if (firstLabel === "yulissaandmatthew") {
      return nextResponseRewrite(
        req,
        `/legacy/yulissaandmatthew.com${pathname}`
      );
    } else if (isTenantHost) {
      return nextResponseRewrite(req, `/tenant/${hostHeader}${pathname}`);
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

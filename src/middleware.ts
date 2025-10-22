import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { decideMultiTenantRouting } from "./lib/rewrites/multitenancy";
import { edgeDb } from "./database/edge";
import { wedding } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const isOnboardingRoute = createRouteMatcher(["/onboarding"]);
const isOnboardingApiRoute = createRouteMatcher(["/api/onboarding/(.*)"]);
const isPublicRoute = createRouteMatcher(["/", "/welcome"]);

function isWelcomeRoute(req: NextRequest): boolean {
  return req.nextUrl.pathname.startsWith("/welcome");
}

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth();

  if (
    isAuthenticated &&
    (isOnboardingRoute(req) || isOnboardingApiRoute(req))
  ) {
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  const multiTenantResponse = await applyMultiTenantRewrite(req);
  if (multiTenantResponse) {
    console.log("multiTenantResponse", multiTenantResponse);
    return multiTenantResponse;
  }
});

async function applyMultiTenantRewrite(req: NextRequest) {
  const requestUrl = req.nextUrl;
  const pathname = requestUrl.pathname;
  const hostHeader = req.headers.get("host") || "";

  const decision = await decideMultiTenantRouting(
    {
      hostHeader,
      pathname,
      isApiRoute: requestUrl.pathname.startsWith("/api"),
      isWelcomeRoute: isWelcomeRoute(req as NextRequest),
    },
    {
      findWeddingIdByApexDomain: async (apexDomain) => {
        try {
          const rows = await edgeDb
            .select({ id: wedding.id })
            .from(wedding)
            .where(eq(wedding.customDomain, apexDomain))
            .limit(1);
          const matchedWeddingId = rows?.[0]?.id as string | undefined;
          return matchedWeddingId ? matchedWeddingId : undefined;
        } catch (error) {
          console.log("custom domain lookup error", error);
          return undefined;
        }
      },
      findWeddingIdBySubdomain: async (subdomain) => {
        try {
          const rows = await edgeDb
            .select({ id: wedding.id })
            .from(wedding)
            .where(eq(wedding.subdomain, subdomain))
            .limit(1);

          // console.log("subdomain lookup rows", rows);
          const matchedWeddingId = rows?.[0]?.id as string | undefined;

          return matchedWeddingId ? matchedWeddingId : undefined;
        } catch (error) {
          console.log("subdomain lookup error", error);
          return undefined;
        }
      },
    }
  );

  if (decision.action === "none") {
    return undefined;
  }
  if (decision.action === "rewrite") {
    return NextResponse.rewrite(new URL(decision.path, requestUrl));
  }
  if (decision.action === "redirect") {
    return NextResponse.redirect(new URL(decision.path, requestUrl));
  }
  return undefined;
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

import { describe, it, expect } from "vitest";
import { decideMultiTenantRouting } from "./multitenancy";

function helpers({
  apexId,
  subId,
  throwApex,
  throwSub,
}: {
  apexId?: number;
  subId?: number;
  throwApex?: boolean;
  throwSub?: boolean;
}) {
  return {
    findWeddingIdByApexDomain: async () => {
      if (throwApex) {
        throw new Error("apex error");
      }
      return apexId;
    },
    findWeddingIdBySubdomain: async () => {
      if (throwSub) {
        throw new Error("sub error");
      }
      return subId;
    },
  };
}

describe("decideMultiTenantRouting", () => {
  it("passes through API routes", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "admin.example.com",
        pathname: "/api/test",
        isApiRoute: true,
        isWelcomeRoute: false,
      },
      helpers({})
    );
    expect(res).toEqual({ action: "none" });
  });

  it("passes through welcome route", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "admin.example.com",
        pathname: "/welcome",
        isApiRoute: false,
        isWelcomeRoute: true,
      },
      helpers({})
    );
    expect(res).toEqual({ action: "none" });
  });

  it("base host blocks /site paths with 404 rewrite", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "admin.example.com",
        pathname: "/site/foo",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({})
    );
    expect(res).toEqual({ action: "rewrite", path: "/404" });
  });

  it("base host resolves apex domain and rewrites to tenant site root", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "www.example.com",
        pathname: "/",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ apexId: 1 })
    );
    expect(res).toEqual({ action: "rewrite", path: "/site/example.com" });
  });

  it("base host resolves apex domain and rewrites to nested path", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "example.com",
        pathname: "/photos",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ apexId: 1 })
    );
    expect(res).toEqual({
      action: "rewrite",
      path: "/site/example.com/photos",
    });
  });

  it("base host apex lookup error rewrites to 404", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "example.com",
        pathname: "/",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ throwApex: true })
    );
    expect(res).toEqual({ action: "rewrite", path: "/404" });
  });

  it("tenant host blocks /dashboard with 404 rewrite", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "acme.example.com",
        pathname: "/dashboard",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ subId: 2 })
    );
    expect(res).toEqual({ action: "rewrite", path: "/404" });
  });

  it("tenant host redirects duplicate /site to /", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "acme.example.com",
        pathname: "/site/foo",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ subId: 2 })
    );
    expect(res).toEqual({ action: "redirect", path: "/" });
  });

  it("tenant host with valid subdomain rewrites root to site", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "acme.example.com",
        pathname: "/",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ subId: 2 })
    );
    expect(res).toEqual({ action: "rewrite", path: "/tenant/acme" });
  });

  it("tenant host with valid subdomain rewrites nested path to site", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "acme.example.com",
        pathname: "/photos",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ subId: 2 })
    );
    expect(res).toEqual({ action: "rewrite", path: "/tenant/acme/photos" });
  });

  it("tenant host with unknown subdomain rewrites to 404", async () => {
    const res = await decideMultiTenantRouting(
      {
        hostHeader: "unknown.example.com",
        pathname: "/",
        isApiRoute: false,
        isWelcomeRoute: false,
      },
      helpers({ subId: undefined })
    );
    expect(res).toEqual({ action: "rewrite", path: "/404" });
  });
});

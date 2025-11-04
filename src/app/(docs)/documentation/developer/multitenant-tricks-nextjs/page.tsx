"use client";

import {
  DocsLayout,
  DocsHeader,
  DocsSection,
  DocsCallout,
  InlineCode,
  DocsBreadcrumb,
  DocsSidebar,
  TableOfContentsItem,
} from "@/components/docs";
import { Zap, Database, Code } from "lucide-react";

const tableOfContents: TableOfContentsItem[] = [
  { id: "the-solution", title: "The Solution", level: 2 },
  { id: "domain-detection", title: "Domain Detection & Routing", level: 2 },
  { id: "data-flow", title: "Data Flow Architecture", level: 2 },
  { id: "redis-caching", title: "Redis Caching Strategy", level: 2 },
  { id: "code-references", title: "Key Files", level: 2 },
];

export default function MultitenantTricksNextjsPage() {
  return (
    <DocsLayout sidebar={<DocsSidebar items={tableOfContents} />}>
      <DocsBreadcrumb
        items={[
          { label: "Developer" },
          { label: "Multitenant Tricks Next.js" },
        ]}
      />

      <DocsHeader
        title="Multitenant Architecture & Performance"
        description="How we keep tenant sites loading fast. Spoiler: Redis caching + React Server Components + smart routing."
      />

      <DocsSection title="The Solution" id="the-solution">
        <p className="text-muted-foreground leading-relaxed mb-6">
          Running the tenant app's fast is the highest priority for marriednext,
          really. This project is built on top of Next.js. Initially, I had
          jotted down several ideas for how the tenant data could be loaded in{" "}
          <a
            href="https://x.com/matthew_bub/status/1983032626211631526"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            this thread
          </a>
          .
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The solution we are currently using is a hybrid approach I did not
          document in the above thread. It combines Next.js middleware routing,
          React Server Components, Redis caching, and React Context to minimize
          database calls while keeping the data fresh.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The short version: we detect the tenant from the domain, fetch their
          data once (from Redis if possible, otherwise Postgres), pass it down
          via context, and reuse it for client-side navigation. This means
          there's literally only one database call per user session, if that.
        </p>
      </DocsSection>

      <DocsSection title="Domain Detection & Routing" id="domain-detection">
        <p className="text-muted-foreground leading-relaxed mb-6">
          Before we can load any tenant data, we need to figure out which tenant
          the request is for. This happens in{" "}
          <InlineCode>src/proxy.ts</InlineCode> using the{" "}
          <InlineCode>getHostType()</InlineCode> function from{" "}
          <InlineCode>src/lib/rewrites/multitenancy.ts</InlineCode>.
        </p>

        <DocsCallout
          variant="info"
          title="Subdomain vs Custom Domain"
          icon={Zap}
        >
          We support both subdomains (
          <InlineCode>example.marriednext.com</InlineCode>) and custom domains (
          <InlineCode>example.com</InlineCode>). Both get cached and routed the
          same way.
        </DocsCallout>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">How Domain Detection Works</h3>
          <ul className="space-y-3 text-muted-foreground ml-6">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Strip the port from the host header (
                <InlineCode>example.com:3000</InlineCode> →{" "}
                <InlineCode>example.com</InlineCode>)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Split by dots to get labels (
                <InlineCode>example.marriednext.com</InlineCode> → [
                <InlineCode>example</InlineCode>,{" "}
                <InlineCode>marriednext</InlineCode>,{" "}
                <InlineCode>com</InlineCode>])
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Check if it has a subdomain (more than 2 labels, or 2+ with
                localhost)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Exclude reserved subdomains like <InlineCode>www</InlineCode>,{" "}
                <InlineCode>admin</InlineCode>, <InlineCode>api</InlineCode>,{" "}
                <InlineCode>app</InlineCode>, etc. (we maintain a blacklist of
                ~50 common subdomains that are reserved for the main app or
                future features)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                If it's a tenant host, rewrite the URL from{" "}
                <InlineCode>/</InlineCode> to{" "}
                <InlineCode>/tenant/example.marriednext.com/</InlineCode>
              </span>
            </li>
          </ul>
        </div>

        <p className="text-muted-foreground leading-relaxed mt-6">
          This rewrite is invisible to the user. They see{" "}
          <InlineCode>example.marriednext.com</InlineCode> in their browser, but
          Next.js internally routes it to the tenant app folder structure. The
          domain becomes a route parameter we can use to fetch data.
        </p>

        <div className="mt-6 bg-muted/50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Reserved Subdomains</h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We maintain a <InlineCode>RESERVED_SUBDOMAINS</InlineCode> array in{" "}
            <InlineCode>src/lib/rewrites/multitenancy.ts</InlineCode> to prevent
            users from claiming subdomains we might need for the main app or
            future features. This includes common names like:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
            <div>
              <InlineCode>www</InlineCode>
            </div>
            <div>
              <InlineCode>admin</InlineCode>
            </div>
            <div>
              <InlineCode>api</InlineCode>
            </div>
            <div>
              <InlineCode>app</InlineCode>
            </div>
            <div>
              <InlineCode>dashboard</InlineCode>
            </div>
            <div>
              <InlineCode>docs</InlineCode>
            </div>
            <div>
              <InlineCode>support</InlineCode>
            </div>
            <div>
              <InlineCode>auth</InlineCode>
            </div>
            <div>
              <InlineCode>blog</InlineCode>
            </div>
            <div>
              <InlineCode>help</InlineCode>
            </div>
            <div>
              <InlineCode>status</InlineCode>
            </div>
            <div>
              <InlineCode>staging</InlineCode>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-4">
            ...and about 40 more. Check the source file for the complete list.
            This prevents conflicts and reserves namespace for future expansion.
          </p>
        </div>
      </DocsSection>

      <DocsSection title="Data Flow Architecture" id="data-flow">
        <p className="text-muted-foreground leading-relaxed mb-6">
          Once we've identified the tenant and rewritten the route, here's the
          full flow of how data gets from the database to the client components:
        </p>

        <div className="bg-muted/50 p-6 rounded-lg mb-6 font-mono text-sm overflow-x-auto">
          <div className="space-y-2 text-muted-foreground">
            <div>1. User visits example.marriednext.com</div>
            <div>2. Middleware detects tenant host</div>
            <div>3. Rewrites to /tenant/example.marriednext.com</div>
            <div>4. Tenant layout (RSC) receives domain param</div>
            <div>5. Calls getWeddingByDomain(domain) → checks Redis</div>
            <div>6. Cache hit? Return cached data ✓</div>
            <div>7. Cache miss? Query Postgres + set Redis cache</div>
            <div>8. Pass weddingData to WeddingDataProvider</div>
            <div>9. Client components use useWeddingData() hook</div>
            <div>10. Client-side nav reuses context data (no refetch)</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Step-by-Step Breakdown
            </h3>
            <ul className="space-y-4 text-muted-foreground ml-6">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1-3.</span>
                <div>
                  <strong>Routing</strong> - Middleware in{" "}
                  <InlineCode>src/proxy.ts</InlineCode> detects the tenant and
                  rewrites the URL internally.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <div>
                  <strong>Server Layout</strong> -{" "}
                  <InlineCode>
                    src/app/(tenant)/tenant/[domain]/layout.tsx
                  </InlineCode>{" "}
                  receives the domain as a route parameter.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">5-7.</span>
                <div>
                  <strong>Data Fetching</strong> -{" "}
                  <InlineCode>getWeddingByDomain()</InlineCode> checks Redis
                  first. On cache miss, it queries Postgres and populates Redis
                  for the next request.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">8.</span>
                <div>
                  <strong>Context Provider</strong> - The server layout passes
                  the fetched data to{" "}
                  <InlineCode>WeddingDataProvider</InlineCode>, which wraps the
                  entire client component tree.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">9-10.</span>
                <div>
                  <strong>Client Components</strong> - Any component can call{" "}
                  <InlineCode>useWeddingData()</InlineCode> to access the data.
                  Client-side navigation (via Next.js Link) reuses this context
                  without refetching.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Redis Caching Strategy" id="redis-caching">
        <p className="text-muted-foreground leading-relaxed mb-6">
          The Redis cache is what makes this whole thing fast. Without it, we'd
          be hitting Postgres on every request, which gets expensive quickly
          with multiple tenants.
        </p>

        <DocsCallout variant="info" title="24 Hour TTL" icon={Database}>
          Cache keys expire after 24 hours as a safety mechanism, but tenant
          sites never show stale data because we actively revalidate the cache
          whenever the wedding owner updates their wedding info.
        </DocsCallout>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Cache Key Format</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Cache keys follow the pattern:{" "}
              <InlineCode>wedding:domain:$&#123;domain&#125;</InlineCode>
            </p>
            <ul className="space-y-2 text-muted-foreground ml-6">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Subdomain example:{" "}
                  <InlineCode>
                    wedding:domain:example.marriednext.com
                  </InlineCode>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>
                  Custom domain example:{" "}
                  <InlineCode>wedding:domain:example.com</InlineCode>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Cache Operations</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We have three main operations defined in{" "}
              <InlineCode>src/lib/admin/invalidateWeddingCache.ts</InlineCode>:
            </p>
            <ul className="space-y-3 text-muted-foreground ml-6">
              <li className="flex gap-2">
                <span className="text-primary font-bold">Read:</span>
                <div>
                  <InlineCode>getWeddingByDomain()</InlineCode> checks Redis
                  first. If the key exists, return it immediately. Otherwise,
                  query the database.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">Update:</span>
                <div>
                  <InlineCode>updateWeddingCache()</InlineCode> sets/updates the
                  cache with fresh data. Called after admin updates. Sets keys
                  for both subdomain and custom domain if applicable.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">Delete:</span>
                <div>
                  <InlineCode>invalidateWeddingCache()</InlineCode> removes
                  cache keys. Used when we want to force a fresh database query
                  on the next request.
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">TTL Configuration</h3>
            <p className="text-muted-foreground leading-relaxed">
              The cache TTL is set to <InlineCode>86400</InlineCode> seconds (24
              hours) in <InlineCode>src/lib/cache/constants.ts</InlineCode>.
              This is exported as <InlineCode>WEDDING_CACHE_TTL</InlineCode> so
              it's easy to adjust if needed.
            </p>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Key Files" id="code-references">
        <p className="text-muted-foreground leading-relaxed mb-6">
          If you need to modify this system, here are the files you'll want to
          look at:
        </p>

        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>src/proxy.ts</InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  The middleware file. Handles domain detection, route rewrites,
                  and authentication checks. This is where the magic starts.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>src/lib/rewrites/multitenancy.ts</InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Contains <InlineCode>getHostType()</InlineCode> which
                  determines if a request is for a tenant site or the main app.
                  Simple but critical.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>src/lib/tenant/getWeddingByDomain.ts</InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  The data fetching layer. Checks Redis first, falls back to
                  Postgres, sets cache on miss. This is where the caching logic
                  lives.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>src/contexts/WeddingDataContext.tsx</InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  The React context provider and{" "}
                  <InlineCode>useWeddingData()</InlineCode> hook. Client
                  components use this to access the wedding data.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>
                    src/app/(tenant)/tenant/[domain]/layout.tsx
                  </InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  The server layout for tenant sites. Calls{" "}
                  <InlineCode>getWeddingByDomain()</InlineCode> and passes the
                  data to the context provider. The glue between server and
                  client.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>
                    src/lib/admin/invalidateWeddingCache.ts
                  </InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Cache management utilities.{" "}
                  <InlineCode>invalidateWeddingCache()</InlineCode> deletes
                  cache keys, <InlineCode>updateWeddingCache()</InlineCode>{" "}
                  updates them. Called from admin API routes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Code className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">
                  <InlineCode>src/lib/cache/constants.ts</InlineCode>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Just has <InlineCode>WEDDING_CACHE_TTL</InlineCode> set to
                  86400 seconds. Change this if you want a different cache
                  duration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DocsSection>
    </DocsLayout>
  );
}

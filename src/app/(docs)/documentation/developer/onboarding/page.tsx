"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, Code, Database } from "lucide-react";
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

const tableOfContents: TableOfContentsItem[] = [
  { id: "tech-stack", title: "Tech Stack", level: 2 },
  { id: "tldr", title: "TLDR", level: 2 },
  { id: "what-is-it-doing", title: "What is it doing?", level: 2 },
];

export default function DeveloperOnboardingPage() {
  return (
    <DocsLayout sidebar={<DocsSidebar items={tableOfContents} />}>
      <DocsBreadcrumb
        items={[{ label: "Developer" }, { label: "Onboarding" }]}
      />

      <DocsHeader
        title="Onboarding (The feature)"
        description="this document will provide a technical overview of how the feature works."
      />

      <DocsCallout variant="info" title="Why the redirect?" icon={Info}>
        If you're getting redirected to /engaged/onboarding and don't know why,
        it's because you've just created a new account and don't have a
        subdomain for your website preview. If we didn't collect the subdomain,
        we'd still have to collect the names of the engaged couple otherwise we
        have no way of uniquely identifying their website. There's a 99% chance
        they aren't going to buy their own domain, so it's our role to make sure
        they have a subdomain to preview their website.
      </DocsCallout>

      <DocsSection title="Tech Stack" id="tech-stack">
        <p className="text-muted-foreground leading-relaxed mb-6">
          This feature is unfortunately, heavily reliant on Clerk and Next.js
          Middleware. (It would be a total rewrite if we were to attempt to
          switch away from either of these core features.) In addition, the
          backend uses Next.js App router API routes, Drizzle as the ORM and
          data is stored in a Postgres database.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          All incoming data is validated through Zod. That's pretty much all that's happening on
          the server. As an "obviously" but worth disclosing, we only pull user
          info from the server. Every request to the onboarding routes should be
          an authenticated one. (
          <InlineCode>src/app/api/onboarding/route.ts</InlineCode>)
        </p>
        <p className="text-muted-foreground leading-relaxed">
          the frontend uses the basics: React, TypeScript, react-hook-form for
          form state, and @tanstack/react-query for the data mutation. Of less
          importance is the client side Zod validation; however that could be
          useful if you find yourself encounter those specific errors.
        </p>
      </DocsSection>

      <DocsSection title="TLDR" id="tldr">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Code className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Frontend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Next.js (App router)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>TypeScript</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Clerk</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Storybook</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>react-hook-form</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>@tanstack/react-query</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Zod</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Backend</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>TypeScript</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Drizzle ORM</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Zod</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Vitest</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DocsSection>

      <DocsSection title="What is it doing?" id="what-is-it-doing">
        <p className="text-muted-foreground leading-relaxed mb-6">
          The frontend is as basic as the backend, the primary route exists at{" "}
          <InlineCode>src/app/engaged/onboarding/page.tsx</InlineCode> and
          there's really nothing to follow beyond that. It's just a lightweight
          screen that mutates data via react-query and manages the form state
          via react-hook-form.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The real magic is in Clerk's "onboarding' feature{" "}
          <a
            href="https://clerk.com/docs/guides/development/add-onboarding-flow"
            className="text-primary hover:underline"
          >
            https://clerk.com/docs/guides/development/add-onboarding-flow
          </a>
          , we've just slightly tailored the solution to our use case. In the{" "}
          <InlineCode>middleware.ts</InlineCode> file, we're running an auth
          check that redirects an authenticated user to{" "}
          <InlineCode>/engaged/onboarding</InlineCode> where they hit that UI we
          mentioned above if the Clerk{" "}
          <InlineCode>publicMetadata.onboardingComplete</InlineCode> value is
          falsey.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The onboarding API is a single POST route used to collect the users
          preferred <InlineCode>subdomain</InlineCode>,{" "}
          <InlineCode>partner1Name</InlineCode>,{" "}
          <InlineCode>partner2Name</InlineCode>, and the{" "}
          <InlineCode>weddingDate</InlineCode>. Technically we only need the
          <InlineCode>subdomain</InlineCode>, but we require the parters names
          as well for a more rich onboarding experience. I'm not opposed to
          changing what fields are collected here or how we go about it. e.g.
          auto-generate subdomains based on names + availability.
        </p>
      </DocsSection>
    </DocsLayout>
  );
}

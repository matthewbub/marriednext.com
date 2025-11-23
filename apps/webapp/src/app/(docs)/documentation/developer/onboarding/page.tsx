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
  {
    id: "collaborator-invitation-flow",
    title: "Collaborator Invitation Flow",
    level: 2,
  },
  {
    id: "onboarding-complete-metadata",
    title: "onboardingComplete Metadata",
    level: 2,
  },
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
          This feature is heavily reliant on Clerk and Next.js middleware (
          <InlineCode>src/proxy.ts</InlineCode>). It would be a total rewrite if
          we were to attempt to switch away from either of these core features.
          In addition, the backend uses Next.js App router API routes, Drizzle
          as the ORM and data is stored in a Postgres database. Collaborator
          invitations are tracked both in Clerk and mirrored in a Postgres table
          (collaboratorInvitations).
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          All incoming data is validated through Zod. That's pretty much all
          that's happening on the server. As an "obviously" but worth
          disclosing, we only pull user info from the server. Every request to
          the onboarding routes should be an authenticated one. (
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
          via react-hook-form. The page checks for pending collaborator
          invitations and displays either the standard onboarding form or an
          invitation acceptance flow.
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
          <InlineCode>src/proxy.ts</InlineCode> file, we're running an auth
          check that redirects an authenticated user to{" "}
          <InlineCode>/engaged/onboarding</InlineCode> where they hit that UI we
          mentioned above if the Clerk{" "}
          <InlineCode>sessionClaims?.metadata?.onboardingComplete</InlineCode>{" "}
          value is falsey.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The onboarding API has three HTTP methods: GET checks for pending
          collaborator invitations, POST creates a new wedding site, and PUT
          accepts a collaborator invitation. The POST route collects the users
          preferred <InlineCode>subdomain</InlineCode>,{" "}
          <InlineCode>partner1Name</InlineCode>,{" "}
          <InlineCode>partner2Name</InlineCode>, and the{" "}
          <InlineCode>weddingDate</InlineCode>. Upon successful onboarding or
          invitation acceptance, the user's Clerk{" "}
          <InlineCode>publicMetadata</InlineCode> is updated with{" "}
          <InlineCode>onboardingComplete: true</InlineCode>,{" "}
          <InlineCode>weddingId</InlineCode>, and <InlineCode>role</InlineCode>.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The onboarding layout itself ({" "}
          <InlineCode>src/app/engaged/onboarding/layout.tsx</InlineCode>) has a
          server-side check that redirects users to the home page if they've
          already completed onboarding, preventing duplicate submissions.
        </p>
      </DocsSection>

      <DocsSection
        title="Collaborator Invitation Flow"
        id="collaborator-invitation-flow"
      >
        <p className="text-muted-foreground leading-relaxed mb-6">
          The onboarding system supports two distinct user flows: creating a new
          wedding site (the standard flow) and accepting a collaborator
          invitation. Both flows end at the onboarding page, but behave
          differently based on whether a pending invitation exists.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Creating an Invitation
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When a wedding site owner invites a collaborator via{" "}
              <InlineCode>/engaged/permissions</InlineCode>, the system:
            </p>
            <ol className="space-y-2 text-muted-foreground ml-6 list-decimal">
              <li>
                Creates a Clerk invitation via{" "}
                <InlineCode>src/app/api/permissions/route.ts</InlineCode> (POST)
                with <InlineCode>publicMetadata</InlineCode> containing{" "}
                <InlineCode>onboardingComplete: true</InlineCode>,{" "}
                <InlineCode>weddingId</InlineCode>, and{" "}
                <InlineCode>role</InlineCode>
              </li>
              <li>
                Mirrors this invitation in the database (
                <InlineCode>collaboratorInvitations</InlineCode> table) with
                status <InlineCode>"pending"</InlineCode>
              </li>
              <li>
                Sends an email to the invitee with a link to{" "}
                <InlineCode>/onboarding</InlineCode>
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Accepting an Invitation
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When an invited user signs up and lands on{" "}
              <InlineCode>/engaged/onboarding</InlineCode>:
            </p>
            <ol className="space-y-2 text-muted-foreground ml-6 list-decimal">
              <li>
                The page makes a GET request to{" "}
                <InlineCode>/api/onboarding</InlineCode> which checks for
                pending invitations matching the user's email
              </li>
              <li>
                If an invitation exists, the UI displays an invitation
                acceptance card instead of the standard onboarding form
              </li>
              <li>
                When the user clicks "Accept Invitation", a PUT request to{" "}
                <InlineCode>/api/onboarding</InlineCode> creates a{" "}
                <InlineCode>weddingUsers</InlineCode> record, updates the
                invitation status to <InlineCode>"accepted"</InlineCode>, and
                sets the user's Clerk metadata
              </li>
              <li>
                The user is redirected to{" "}
                <InlineCode>/engaged/permissions</InlineCode> where they can see
                their new role
              </li>
            </ol>
          </div>

          <DocsCallout
            variant="info"
            title="Invitation Metadata Doesn't Persist"
            icon={Info}
          >
            Although the Clerk invitation includes{" "}
            <InlineCode>publicMetadata</InlineCode>, this metadata doesn't
            automatically transfer to the user's account. That's why we mirror
            the invitation in the database - when the user accepts, we read from
            our database table and manually set their Clerk metadata.
          </DocsCallout>
        </div>
      </DocsSection>

      <DocsSection
        title="onboardingComplete Metadata"
        id="onboarding-complete-metadata"
      >
        <p className="text-muted-foreground leading-relaxed mb-6">
          The <InlineCode>onboardingComplete</InlineCode> field is stored in
          Clerk's <InlineCode>publicMetadata</InlineCode> object and is the key
          mechanism that controls whether a user needs to complete onboarding.
          When read from session claims, it's accessed via{" "}
          <InlineCode>sessionClaims?.metadata?.onboardingComplete</InlineCode>.
          It's defined as an optional boolean in{" "}
          <InlineCode>types/globals.d.ts</InlineCode>.
        </p>

        <DocsCallout variant="info" title="Never Set to False" icon={Info}>
          The <InlineCode>onboardingComplete</InlineCode> field is never
          explicitly set to <InlineCode>false</InlineCode> anywhere in the
          codebase. It only ever gets set to <InlineCode>true</InlineCode>. New
          users start with this field as <InlineCode>undefined</InlineCode>,
          which is falsy and triggers the onboarding redirect.
        </DocsCallout>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Where It Gets Set to True
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              There are three places where{" "}
              <InlineCode>onboardingComplete</InlineCode> is set to{" "}
              <InlineCode>true</InlineCode>:
            </p>
            <ul className="space-y-3 text-muted-foreground ml-6">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <div>
                  <strong>When a user completes onboarding (POST)</strong> -{" "}
                  <InlineCode>src/app/api/onboarding/route.ts</InlineCode> sets
                  it after successfully creating the wedding record and
                  associating the user with it. Also stores{" "}
                  <InlineCode>weddingId</InlineCode> and{" "}
                  <InlineCode>role: "spouse"</InlineCode> in the metadata.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <div>
                  <strong>
                    When a user accepts a collaborator invitation (PUT)
                  </strong>{" "}
                  - <InlineCode>src/app/api/onboarding/route.ts</InlineCode>{" "}
                  sets it when an invited user accepts an invitation,
                  associating them with an existing wedding. Also stores{" "}
                  <InlineCode>weddingId</InlineCode> and{" "}
                  <InlineCode>role</InlineCode> in the metadata.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <div>
                  <strong>When creating a collaborator invitation</strong> -{" "}
                  <InlineCode>src/app/api/permissions/route.ts</InlineCode>{" "}
                  includes it in the Clerk invitation's{" "}
                  <InlineCode>publicMetadata</InlineCode>, though this metadata
                  doesn't persist through the invitation flow. The actual
                  setting happens via option #2 when the user accepts.
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              Where It Gets Checked
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The primary check happens in <InlineCode>src/proxy.ts</InlineCode>{" "}
              (line 44). For authenticated users on non-tenant hosts, if{" "}
              <InlineCode>
                sessionClaims?.metadata?.onboardingComplete
              </InlineCode>{" "}
              is falsy (undefined, null, or false), the user gets redirected to{" "}
              <InlineCode>/engaged/onboarding</InlineCode>.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              A secondary check exists in{" "}
              <InlineCode>src/app/engaged/onboarding/layout.tsx</InlineCode>{" "}
              (line 9) which redirects users away from the onboarding page if
              they've already completed it, preventing them from creating
              duplicate wedding sites.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The proxy check is bypassed for public routes and for the
              onboarding routes themselves (to prevent redirect loops). Once the
              field is set to <InlineCode>true</InlineCode>, users can access
              the rest of the authenticated application.
            </p>
          </div>
        </div>
      </DocsSection>
    </DocsLayout>
  );
}

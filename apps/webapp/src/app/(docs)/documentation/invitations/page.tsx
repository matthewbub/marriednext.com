"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserPlus,
  Info,
  AlertCircle,
  LayoutGrid,
  List,
  ArrowUpDown,
} from "lucide-react";
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
  { id: "what-is-invitation", title: "What is an Invitation?", level: 2 },
  { id: "guest-capacity", title: "Guest Capacity", level: 2 },
  { id: "how-it-works", title: "How It Works", level: 2 },
  { id: "managing-your-list", title: "Managing Your List", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 2 },
];

export default function InvitationsDocPage() {
  return (
    <DocsLayout sidebar={<DocsSidebar items={tableOfContents} />}>
      <DocsBreadcrumb items={[{ label: "Invitations" }]} />

      <DocsHeader
        title="Invitations"
        description="How to organize your guests into invitation groups and manage your wedding guest list"
      />

      <DocsSection title="What is an Invitation?" id="what-is-invitation">
        <p className="text-muted-foreground leading-relaxed mb-4">
          An <InlineCode>Invitation</InlineCode> is how you organize and group
          your wedding guests. It's basically a single invitation card that you
          send to multiple people from the same family or group.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          For example, when inviting the Smith family with parents and three
          children, add them all to one invitation group. This makes it easier
          for you to manage RSVPs and track attendance as a unit.
        </p>
      </DocsSection>

      <DocsSection title="Guest Capacity" id="guest-capacity">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Up to 8 Guests</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Each invitation can hold up to 8 people. Use as many or as few
                as you need for each family or group. Plus ones are handled
                separately and don&apos;t count toward this limit.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Flexible Groups</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Invite 1 person, a couple, or an entire family of 8. Whatever
                works for your guest list.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </DocsSection>

      <DocsSection title="How It Works" id="how-it-works">
        <div className="space-y-4">
          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-3">
              How to Create a New Invitation
            </h3>
            <ol className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>
                  Navigate to the Guest List page and click the{" "}
                  <InlineCode>Add Guest</InlineCode> button
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>
                  Enter the first guest&apos;s name in the dialog that appears
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>
                  If you&apos;re only adding one guest, you can check the{" "}
                  <InlineCode>Add a Plus One</InlineCode> option to allow them
                  to bring a guest
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <span>
                  Click <InlineCode>Add Another Guest</InlineCode> to add more
                  people to this invitation (up to 8 total)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">5.</span>
                <span>
                  Remove any guest by clicking the <InlineCode>X</InlineCode>{" "}
                  button next to their name
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">6.</span>
                <span>
                  Click <InlineCode>Complete</InlineCode> when you&apos;re done
                  adding guests
                </span>
              </li>
            </ol>
            <DocsCallout
              variant="info"
              title="Pro Tip"
              icon={Info}
              className="mt-4"
            >
              The Plus One option is only available when adding a single guest.
              Once you add a second guest, all guests must be named
              individually.
            </DocsCallout>
          </div>

          <div className="p-6 rounded-lg border bg-card">
            <h3 className="font-semibold text-lg mb-3">Example Scenarios</h3>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Single Guest</p>
                <p>John Smith</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  1 person per invitation
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">
                  Single Guest with Plus One
                </p>
                <p>Sarah Williams</p>
                <p>Sarah Williams&apos;s Plus One</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  2 people per invitation (1 named + 1 plus one)
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Couple</p>
                <p>Jane Doe</p>
                <p>John Doe</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  2 people per invitation
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Large Family</p>
                <p>Robert Johnson (Father)</p>
                <p>Mary Johnson (Mother)</p>
                <p>Sarah Johnson (Daughter)</p>
                <p>Michael Johnson (Son)</p>
                <p>Emily Johnson (Daughter)</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  5 people per invitation
                </p>
              </div>
            </div>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Managing Your List" id="managing-your-list">
        <p className="text-muted-foreground leading-relaxed mb-6">
          Once you have invitations set up, you can organize and view them in
          different ways to make managing your guest list easier.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ArrowUpDown className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Sort Your List</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-3">
                You can sort your invitations by:
              </CardDescription>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>A → Z</strong> or <strong>Z → A</strong>{" "}
                    (alphabetical)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Newest First</strong> or{" "}
                    <strong>Oldest First</strong> (by creation date)
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Recently Updated</strong> (shows your most recent
                    changes first)
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <div className="flex gap-1">
                    <LayoutGrid className="w-4 h-4 text-primary" />
                    <List className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <CardTitle>Switch Views</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed mb-3">
                Choose how you want to see your guest list:
              </CardDescription>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Expanded View</strong> - See all guest details and
                    RSVP status
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Condensed View</strong> - Quick overview with just
                    names and attendance counts
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold text-lg mb-3">Search Your Guests</h3>
          <p className="text-muted-foreground">
            Use the search bar to quickly find specific guests or invitation
            groups by name. Perfect when you need to check on someone&apos;s
            RSVP status or update their information.
          </p>
        </div>
      </DocsSection>

      <DocsSection title="Best Practices" id="best-practices">
        <div className="space-y-4">
          <DocsCallout
            variant="warning"
            title="Things to Remember"
            icon={AlertCircle}
          >
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Every invitation needs at least one person</li>
              <li>
                Group guests who will RSVP together (families, couples, or close
                friends)
              </li>
              <li>
                Use the invitation group name to identify the household or
                family unit
              </li>
            </ul>
          </DocsCallout>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Managing Your Guest List</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Use descriptive names like &quot;The Smith Family&quot; or
                    &quot;Johnson Household&quot;
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Keep families together in one invitation - it makes RSVP
                    tracking easier
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Got a family with more than 8 members? Split them into
                    multiple invitations (e.g., parents + younger kids in one,
                    adult children in another)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  <span>
                    Give single guests or unrelated couples their own
                    invitations
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DocsSection>
    </DocsLayout>
  );
}

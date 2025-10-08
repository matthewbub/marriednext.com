import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, Shield } from "lucide-react";
import {
  DocsLayout,
  DocsHeader,
  DocsSection,
  DocsCodeBlock,
  InlineCode,
  DocsBreadcrumb,
  DocsSidebar,
  TableOfContentsItem,
} from "@/components/docs";

const tableOfContents: TableOfContentsItem[] = [
  { id: "what-is-telemetry", title: "What is telemetry?", level: 2 },
  { id: "key-features", title: "Key Features", level: 2 },
  { id: "session-storage", title: "Session Storage", level: 3 },
  { id: "debouncing", title: "Debouncing & Intent Detection", level: 3 },
  { id: "events-we-capture", title: "Events We Capture", level: 2 },
];

export default function TelemetryDocPage() {
  return (
    <DocsLayout sidebar={<DocsSidebar items={tableOfContents} />}>
      <DocsBreadcrumb items={[{ label: "Telemetry" }]} />

      <DocsHeader
        title="Telemetry"
        description="Understanding how we track and improve your experience at weddingsbymat.com"
      />

      {/* What is Telemetry Section */}
      <DocsSection title="What is telemetry?" id="what-is-telemetry">
        <p className="text-muted-foreground leading-relaxed mb-4">
          It&apos;s used to track user behavior&apos;s. Not in a way that is
          specific to you personally, but rather to a group of users consuming a
          product. Similar too, but less invasive than how a Grocery Store
          tracks their customers behaviors to optimize the experience.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          This document explains in depth, how telemetry is used in the context
          of weddingsbymat.com.
        </p>
      </DocsSection>

      {/* Key Features Grid */}
      <DocsSection id="key-features">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Session Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                The application set a randomly generated unique identifier{" "}
                <InlineCode>telemetry_session_id</InlineCode> in the browser
                session storage to ensure its tracking a single browser session.
                This enables us to see patterns that we use to further enhance
                the experience for you.
              </CardDescription>
              <DocsCodeBlock label="The unique identifier is non-sensible, and looks like this:">
                session_1759820573058_q54i9la
              </DocsCodeBlock>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Debouncing & Intent Detection</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                To ensure we only capture meaningful user preferences and not
                accidental clicks or exploratory behavior, we implement a
                3-second delay before recording any telemetry event.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </DocsSection>

      {/* Events We Capture Section */}
      <DocsSection title="Events We Capture" id="events-we-capture">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Guest List Display: View Mode Preference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                The Guest List Display component tracks how users prefer to view
                their guest list.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Guest List Display: Sort Option Preference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                The Guest List Display component tracks which sort options users
                prefer when organizing their guest list.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </DocsSection>
    </DocsLayout>
  );
}

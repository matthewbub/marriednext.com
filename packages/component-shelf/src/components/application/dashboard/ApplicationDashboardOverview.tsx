import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import {
  Users,
  Mail,
  Send,
  CheckCircle2,
  XCircle,
  Globe,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Camera,
  Grid3X3,
  CalendarHeart,
} from "lucide-react";

export interface HomeStatsData {
  totalGuests: number;
  totalInvitations: number;
  respondedGuests: number;
  responseRate: number;
  attendingGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  weddingDate: string | null;
  coupleNames: {
    nameA: string;
    nameB: string;
    displayName: string;
  };
  subscriptionPlan: string;
  siteUrl: string;
  subdomain: string | null;
  customDomain: string | null;
  websiteTemplate: string;
}

export interface ApplicationDashboardOverviewProps {
  data?: HomeStatsData;
  isLoading?: boolean;
  Link?: React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
}

const recentActivity = [
  {
    name: "Emma Thompson",
    action: "accepted the invitation",
    time: "2 hours ago",
    status: "accepted",
  },
  {
    name: "James Wilson",
    action: "declined the invitation",
    time: "5 hours ago",
    status: "declined",
  },
  {
    name: "Oliver & Sophie Brown",
    action: "accepted with +1",
    time: "Yesterday",
    status: "accepted",
  },
  {
    name: "Charlotte Davis",
    action: "updated dietary requirements",
    time: "Yesterday",
    status: "updated",
  },
  {
    name: "William Taylor",
    action: "is awaiting response",
    time: "2 days ago",
    status: "pending",
  },
];

const quickActions = [
  {
    name: "Edit Website",
    icon: Globe,
    href: "/dashboard/website",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Add Guests",
    icon: Users,
    href: "/dashboard/guests",
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Seating Chart",
    icon: Grid3X3,
    href: "/dashboard/seating",
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    name: "Upload Photos",
    icon: Camera,
    href: "/dashboard/memories",
    color: "bg-chart-4/20 text-chart-4",
  },
];

export function ApplicationDashboardOverview({
  data,
  isLoading,
  Link,
}: ApplicationDashboardOverviewProps) {
  const LinkComponent = Link ?? "a";
  console.log("data", data);
  const displayName =
    data?.coupleNames?.displayName ||
    (data?.coupleNames?.nameA && data?.coupleNames?.nameB
      ? `${data.coupleNames.nameA} & ${data.coupleNames.nameB}`
      : "");


  const iframeUrl = data?.subdomain ? `/tenant/${data?.subdomain}` : null;
  console.log("iframeUrl", iframeUrl);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            {isLoading ? (
              <span className="inline-block h-8 w-48 bg-muted animate-pulse rounded" />
            ) : (
              `Welcome back${displayName ? `, ${displayName}` : ""}`
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your wedding planning.
          </p>
        </div>
        <Button className="sm:w-auto">
          <Globe className="h-4 w-4 mr-2" />
          View Live Site
          <ExternalLink className="h-3 w-3 ml-2" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Invitations</p>
              <p className="text-2xl font-semibold mt-1">
                {isLoading ? "-" : data?.totalInvitations ?? 0}
              </p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Guests</p>
              <p className="text-2xl font-semibold mt-1">
                {isLoading ? "-" : data?.totalGuests ?? 0}
              </p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Attending</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {isLoading ? "-" : data?.attendingGuests ?? 0}
              </p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Declined</p>
              <p className="text-2xl font-semibold text-red-500 mt-1">
                {isLoading ? "-" : data?.declinedGuests ?? 0}
              </p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Awaiting</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">
                {isLoading ? "-" : data?.pendingGuests ?? 0}
              </p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-semibold mt-1">
                {isLoading
                  ? "-"
                  : data?.totalGuests && data.totalGuests > 0
                    ? Math.round(
                        ((data.attendingGuests + data.declinedGuests) /
                          data.totalGuests) *
                          100
                      )
                    : 0}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Website Preview Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">Your Wedding Website</CardTitle>
                <CardDescription>
                  {data?.siteUrl || "Not set up yet"}
                </CardDescription>
              </div>
              <LinkComponent
                href="/v2/engaged/website"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Customize
                <ArrowRight className="h-3 w-3 ml-2" />
              </LinkComponent>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                {data?.siteUrl ? (
                  <iframe
                    src={iframeUrl || ""}
                    title="Wedding website preview"
                    className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
                  />
                ) : (
                  <img
                    src="/placeholder-website-preview.jpg"
                    alt="Wedding website preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>Published</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Template:{" "}
                  <span className="text-foreground">
                    {data?.websiteTemplate}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground ml-auto">
                  342 visits this month
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">RSVP Progress</CardTitle>
              <CardDescription>Track your guest responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Responses received
                  </span>
                  <span className="font-medium text-foreground">
                    {data?.respondedGuests ?? 0} of {data?.totalGuests ?? 0}{" "}
                    guests
                  </span>
                </div>
                <Progress value={data?.responseRate ?? 0} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-4 rounded-lg bg-accent/10">
                  <p className="text-2xl font-semibold text-accent">
                    {isLoading ? "-" : data?.attendingGuests ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Attending
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-destructive/10">
                  <p className="text-2xl font-semibold text-destructive">
                    {isLoading ? "-" : data?.declinedGuests ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Declined</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-2xl font-semibold text-muted-foreground">
                    {isLoading ? "-" : data?.pendingGuests ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seating Overview */}
          {/* Save the Date CTA */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="relative overflow-hidden border-primary/20 hover:border-primary/40 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <CalendarHeart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Save the Date
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Collect early headcounts
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Let guests indicate their likelihood of attending before
                  sending formal invitations.
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <a href="/v2/engaged/save-the-date">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Seating Planner CTA */}
            <Card className="relative overflow-hidden border-accent/20 hover:border-accent/40 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-lg bg-accent/10">
                    <Grid3X3 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Seating Planner
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Arrange your tables
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop guests to tables. Visualize your reception
                  layout with ease.
                </p>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  asChild
                >
                  <a href="/v2/engaged/seating">
                    Open Planner
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {action.name}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest guest responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                        activity.status === "accepted"
                          ? "bg-accent"
                          : activity.status === "declined"
                          ? "bg-destructive"
                          : activity.status === "pending"
                          ? "bg-muted-foreground"
                          : "bg-chart-2"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{activity.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4" size="sm">
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Upgrade CTA */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Upgrade Available
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get premium templates, custom domain, and unlimited photo
                storage.
              </p>
              <Button className="w-full" size="sm">
                Upgrade for $29
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

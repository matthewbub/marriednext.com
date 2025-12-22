import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button, buttonVariants } from "../../../components/ui/button";
import { Skeleton } from "../../../components/ui/skeleton";
import {
  Users,
  Globe,
  ExternalLink,
  ArrowRight,
  Camera,
  Grid3X3,
  CalendarHeart,
} from "lucide-react";
import { RsvpProgress } from "./RsvpProgress";

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
const quickActions = [
  {
    name: "Edit Website",
    icon: Globe,
    href: "/engaged/website",
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Add Guests",
    icon: Users,
    href: "/engaged/guests",
    color: "bg-accent/10 text-accent",
  },
  {
    name: "Seating Chart",
    icon: Grid3X3,
    href: "/engaged/seating",
    color: "bg-chart-2/20 text-chart-2",
  },
  {
    name: "Upload Photos",
    icon: Camera,
    href: "/engaged/memories",
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
        {data?.siteUrl ? (
          <Button className="sm:w-auto" asChild>
            <a href={data.siteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4 mr-2" />
              View Live Site
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        ) : (
          <Button className="sm:w-auto" disabled>
            <Globe className="h-4 w-4 mr-2" />
            View Live Site
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <RsvpProgress
            isLoading={isLoading}
            totalInvitations={data?.totalInvitations ?? 0}
            totalGuests={data?.totalGuests ?? 0}
            respondedGuests={data?.respondedGuests ?? 0}
            responseRate={data?.responseRate ?? 0}
            attendingGuests={data?.attendingGuests ?? 0}
            declinedGuests={data?.declinedGuests ?? 0}
            pendingGuests={data?.pendingGuests ?? 0}
          />

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
                href="/engaged/website"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                Customize
                <ArrowRight className="h-3 w-3 ml-2" />
              </LinkComponent>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : data?.siteUrl ? (
                  <iframe
                    src={iframeUrl || ""}
                    title="Wedding website preview"
                    className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <div className="text-center p-8">
                      <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Website preview will appear here
                      </p>
                    </div>
                  </div>
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
              </div>
            </CardContent>
          </Card>

          {/* <div className="grid gap-6 sm:grid-cols-2">
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
                  <a href="/engaged/save-the-date">
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
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
                  <a href="/engaged/seating">
                    Open Planner
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div> */}
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
                <LinkComponent
                  key={action.name}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {action.name}
                  </span>
                </LinkComponent>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {/* <Card>
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
          </Card> */}

          {/* Upgrade CTA */}
          {/* <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border-primary/20">
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
          </Card> */}
        </div>
      </div>
    </div>
  );
}

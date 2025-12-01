import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import {
  Users,
  Mail,
  CheckCircle2,
  XCircle,
  Globe,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Camera,
  Grid3X3,
} from "lucide-react";

export interface HomeStatsData {
  totalGuests: number;
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
}

export interface ApplicationDashboardOverviewProps {
  data?: HomeStatsData;
  isLoading?: boolean;
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
}: ApplicationDashboardOverviewProps) {
  const displayName =
    data?.coupleNames?.displayName ||
    (data?.coupleNames?.nameA && data?.coupleNames?.nameB
      ? `${data.coupleNames.nameA} & ${data.coupleNames.nameB}`
      : "");

  const stats = [
    {
      name: "Total Guests",
      value: data?.totalGuests ?? 0,
      subtext: "invited",
      icon: Users,
    },
    {
      name: "RSVPs Received",
      value: data?.respondedGuests ?? 0,
      subtext: `${data?.responseRate ?? 0}% response rate`,
      icon: Mail,
    },
    {
      name: "Attending",
      value: data?.attendingGuests ?? 0,
      subtext: `of ${data?.respondedGuests ?? 0} responses`,
      icon: CheckCircle2,
      color: "text-accent",
    },
    {
      name: "Declined",
      value: data?.declinedGuests ?? 0,
      subtext: `of ${data?.respondedGuests ?? 0} responses`,
      icon: XCircle,
      color: "text-destructive",
    },
  ];

  const formattedDate = data?.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon
                  className={`h-5 w-5 ${stat.color || "text-muted-foreground"}`}
                />
                <span className="text-xs text-muted-foreground">
                  {stat.subtext}
                </span>
              </div>
              <div className="mt-4">
                {isLoading ? (
                  <span className="inline-block h-9 w-16 bg-muted animate-pulse rounded" />
                ) : (
                  <p className="text-3xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.name}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
              <Button variant="outline" size="sm">
                Customize
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                <img
                  src="/elegant-wedding-website-preview-with-couple-photo.jpg"
                  alt="Wedding website preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="font-serif text-2xl text-white">
                    {displayName || "Your Wedding"}
                  </p>
                  <p className="text-white/80 text-sm">
                    {formattedDate || "Set your wedding date"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span>Published</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Template: <span className="text-foreground">Sage Garden</span>
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
              <Button variant="outline" className="w-full bg-transparent">
                Send Reminder to Pending Guests
              </Button>
            </CardContent>
          </Card>

          {/* Seating Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">Seating Arrangement</CardTitle>
                <CardDescription>
                  8 tables configured, 72 guests seated
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Open Planner
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
                  <div
                    key={table}
                    className="aspect-square rounded-full border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                  >
                    <span className="text-xs text-muted-foreground">Table</span>
                    <span className="font-semibold text-foreground">
                      {table}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {((table * 3) % 5) + 6}/10
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

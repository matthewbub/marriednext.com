"use client";
import type { ApplicationLinkComponent } from "../link-types";
import type { DashboardWeddingData } from "./DashboardLayout";
import { cn } from "../../../lib/utils";
import {
  LayoutDashboard,
  Globe,
  Users,
  Grid3X3,
  Camera,
  Settings,
  HelpCircle,
  ExternalLink as ExternalLinkIcon,
} from "lucide-react";
import { MarriedNextLogo } from "../../ui/married-next-logo";
import { Sheet, SheetContent } from "../../../components/ui/sheet";

const mainNavItems = [
  { name: "Overview", href: "/engaged", icon: LayoutDashboard },
  { name: "Website", href: "/engaged/website", icon: Globe },
  { name: "Guests & RSVPs", href: "/engaged/guests", icon: Users },
  { name: "Seating", href: "/engaged/seating", icon: Grid3X3 },
  { name: "Memories", href: "/engaged/memories", icon: Camera },
];

const bottomNavItems = [
  { name: "Settings", href: "/engaged/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

function formatWeddingDate(dateString: string | null): string {
  if (!dateString) return "Date TBD";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysUntilWedding(dateString: string | null): string {
  if (!dateString) return "Set your date";
  const weddingDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  weddingDate.setHours(0, 0, 0, 0);
  const diffTime = weddingDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return "Wedding day passed";
  if (diffDays === 0) return "Today's the day!";
  if (diffDays === 1) return "1 day to go";
  return `${diffDays} days to go`;
}

function getCoupleDisplayName(wedding?: DashboardWeddingData): string {
  if (!wedding) return "Your Wedding";
  if (wedding.displayName) return wedding.displayName;
  if (wedding.nameA && wedding.nameB)
    return `${wedding.nameA} & ${wedding.nameB}`;
  return "Your Wedding";
}

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  Link?: ApplicationLinkComponent;
  pathname?: string;
  wedding?: DashboardWeddingData;
}

export function ApplicationDashboardSidebar({
  mobileOpen = false,
  onMobileClose,
  Link = "a",
  pathname = "/",
  wedding,
}: DashboardSidebarProps) {
  const coupleDisplayName = getCoupleDisplayName(wedding);
  const weddingDateFormatted = formatWeddingDate(wedding?.eventDate ?? null);
  const daysUntil = getDaysUntilWedding(wedding?.eventDate ?? null);

  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Your Wedding
        </p>
        <p className="font-serif text-lg text-foreground">
          {coupleDisplayName}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {weddingDateFormatted}
        </p>
        {!wedding?.eventDate ? (
          <Link href={`/engaged/settings#date-time`}>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs text-muted-foreground">{daysUntil}</span>
              <ExternalLinkIcon className="h-3 w-3 text-muted-foreground hover:text-primary" />
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 mt-3">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">{daysUntil}</span>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Bottom Navigation */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {bottomNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <MarriedNextLogo className="h-6 w-6" />
              <span className="font-serif text-xl font-semibold text-foreground">
                Married Next
              </span>
            </Link>
          </div>
          <SidebarContent />
        </div>
      </aside>

      <Sheet
        open={mobileOpen}
        onOpenChange={(open) => !open && onMobileClose?.()}
      >
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 h-full">
            {/* Logo */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={onMobileClose}
              >
                <MarriedNextLogo className="h-6 w-6" />
                <span className="font-serif text-xl font-semibold text-foreground">
                  Married Next
                </span>
              </Link>
            </div>
            <SidebarContent onNavigate={onMobileClose} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
        <div className="flex justify-around py-2">
          {mainNavItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

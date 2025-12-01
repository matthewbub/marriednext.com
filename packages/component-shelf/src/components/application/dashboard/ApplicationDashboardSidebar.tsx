"use client";
import type { ApplicationLinkComponent } from "../link-types";
import { cn } from "@/lib/utils";
import {
  Heart,
  LayoutDashboard,
  Globe,
  Users,
  Grid3X3,
  Camera,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Sheet, SheetContent } from "../../../components/ui/sheet";

const mainNavItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Website", href: "/dashboard/website", icon: Globe },
  { name: "Guests & RSVPs", href: "/dashboard/guests", icon: Users },
  { name: "Seating", href: "/dashboard/seating", icon: Grid3X3 },
  { name: "Memories", href: "/dashboard/memories", icon: Camera },
];

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Help", href: "/dashboard/help", icon: HelpCircle },
];

interface DashboardSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  Link?: ApplicationLinkComponent;
  pathname?: string;
}

export function ApplicationDashboardSidebar({
  mobileOpen = false,
  onMobileClose,
  Link = "a",
  pathname = "/",
}: DashboardSidebarProps) {
  const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {/* Couple Names */}
      <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          Your Wedding
        </p>
        <p className="font-serif text-lg text-foreground">Sarah & Michael</p>
        <p className="text-sm text-muted-foreground mt-1">June 15, 2025</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground">168 days to go</span>
        </div>
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
              <li>
                <button className="group flex w-full gap-x-3 rounded-lg p-2.5 text-sm font-medium leading-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                  <LogOut className="h-5 w-5 shrink-0" />
                  Log out
                </button>
              </li>
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
              <Heart className="h-6 w-6 text-primary fill-primary" />
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
                <Heart className="h-6 w-6 text-primary fill-primary" />
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

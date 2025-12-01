"use client";

import type { DashboardUserData } from "./ApplicationDashboardLayout";
import { Bell, Search, Menu, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";

function truncateEmail(email: string, maxLength: number = 20): string {
  if (email.length <= maxLength) return email;
  return `${email.slice(0, maxLength - 3)}...`;
}

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  user?: DashboardUserData;
}

export function ApplicationDashboardHeader({
  onMenuClick,
  user,
}: DashboardHeaderProps) {
  const displayName =
    user?.fullName ||
    (user?.email ? truncateEmail(user.email, 20) : null) ||
    "User";
  const userInitials = user?.initials || "U";
  const userImageUrl = user?.imageUrl || undefined;
  const subscriptionPlan = user?.subscriptionPlan || "Free Plan";

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-card px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="lg:hidden p-2.5 text-muted-foreground hover:text-foreground transition-colors"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" />
      </button>

      <div className="h-6 w-px bg-border lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center max-w-md">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search guests, tables..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="hidden sm:flex">
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Add Guest</DropdownMenuItem>
              <DropdownMenuItem>Add Table</DropdownMenuItem>
              <DropdownMenuItem>Upload Photos</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Send Invitations</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
          </button>

          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userImageUrl} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-foreground truncate max-w-[160px]">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {subscriptionPlan}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Invite Co-Planner</DropdownMenuItem>
              <DropdownMenuItem>Upgrade to Premium</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

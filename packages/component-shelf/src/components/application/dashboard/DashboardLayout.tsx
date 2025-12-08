"use client";

import type React from "react";
import type { ApplicationLinkComponent } from "../link-types";

import { useState } from "react";
import { ApplicationDashboardSidebar } from "./DashboardSidebar";
import { ApplicationDashboardHeader } from "./DashboardHeader";

export interface DashboardUserData {
  fullName: string;
  email: string;
  imageUrl: string | null;
  initials: string;
  subscriptionPlan: string;
}

export interface DashboardWeddingData {
  displayName: string;
  nameA: string;
  nameB: string;
  eventDate: string | null;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: DashboardUserData;
  wedding?: DashboardWeddingData;
  Link?: ApplicationLinkComponent;
  pathname?: string;
  onLogout?: () => void;
  onInviteClick?: () => void;
}

export function ApplicationDashboardLayout({
  children,
  user,
  wedding,
  Link,
  pathname,
  onLogout,
  onInviteClick,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <ApplicationDashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        wedding={wedding}
        Link={Link}
        pathname={pathname}
      />
      <div className="lg:pl-64">
        <ApplicationDashboardHeader
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
          onLogout={onLogout}
          onInviteClick={onInviteClick}
        />
        <main className="p-6 pb-24 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}

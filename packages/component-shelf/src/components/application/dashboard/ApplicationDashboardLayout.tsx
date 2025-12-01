"use client";

import type React from "react";

import { useState } from "react";
import { ApplicationDashboardSidebar } from "./ApplicationDashboardSidebar";
import { ApplicationDashboardHeader } from "./ApplicationDashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function ApplicationDashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <ApplicationDashboardSidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="lg:pl-64">
        <ApplicationDashboardHeader
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="p-6 pb-24 lg:pb-6">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Menu, X } from "lucide-react";
import { MarriedNextLogo } from "../ui/married-next-logo";
import type { ApplicationLinkComponent } from "./link-types";

interface NavbarProps {
  Link?: ApplicationLinkComponent;
  loginUrl?: string;
  signUpUrl?: string;
  isAuthenticated?: boolean;
  dashboardUrl?: string;
}

export function Navbar({
  Link = "a",
  loginUrl = "/sign-in",
  signUpUrl = "/register",
  isAuthenticated = false,
  dashboardUrl = "/engaged",
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MarriedNextLogo className="h-6 w-6" />
            <span className="font-serif text-xl font-semibold text-foreground">
              Married Next
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Button size="sm" asChild>
                <Link href={dashboardUrl}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={loginUrl}>Log in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={signUpUrl}>Get Started</Link>
                </Button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              <div className="px-2 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Product
              </div>
              <Link
                href="/#features"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/templates"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>

              <div className="my-2 border-t border-border" />

              <Link
                href="/#pricing"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/blog"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Public Source
              </Link>

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                {isAuthenticated ? (
                  <Button size="sm" asChild>
                    <Link
                      href={dashboardUrl}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild>
                      <Link
                        href={loginUrl}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link
                        href={signUpUrl}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

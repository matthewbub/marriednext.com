"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  Heart,
  ChevronDown,
  Layout,
  Users,
  Github,
} from "lucide-react";

interface ApplicationNavbarProps {
  isAuthenticated?: boolean;
}

export function ApplicationNavbar({
  isAuthenticated = false,
}: ApplicationNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const action = isAuthenticated
    ? { href: "/engaged", label: "My Wedding" }
    : { href: "/register", label: "Join for free" };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">
              Married Next
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors outline-none">
                Product
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <a
                    href="/#features"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Heart className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Features</div>
                      <div className="text-xs text-muted-foreground">
                        Everything included
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="/templates"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Layout className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Templates</div>
                      <div className="text-xs text-muted-foreground">
                        Beautiful designs
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="/seating"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Seating Planner</div>
                      <div className="text-xs text-muted-foreground">
                        Free, no account needed
                      </div>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <a
              href="/#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a
              href="/blog"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="View on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <a
              href={action.href}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-border/50"
            >
              {action.label}
            </a>
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
              <a
                href="/#features"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="/templates"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </a>
              <a
                href="/seating"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Seating Planner
              </a>

              <div className="my-2 border-t border-border" />

              <a
                href="/#pricing"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="/blog"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                Open Source
              </a>

              <div className="mt-4 border-t border-border pt-4">
                <a
                  href={action.href}
                  className="block rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-border/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {action.label}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function NavBar() {
  const [open, setOpen] = React.useState(false);

  return (
    <nav className="w-full py-2 z-10 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                          href="/"
                        >
                          <span className="mt-4 mb-2 text-lg font-medium leading-tight font-handwritten-font">
                            Wedding Cake Studio
                          </span>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Delicious wedding websites made served fresh
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/about" title="About">
                      Learn more about me and how I can help you.
                    </ListItem>
                    <ListItem href="/contact" title="Contact">
                      Reach out for a custom quote or consultation.
                    </ListItem>
                    <ListItem href="/support" title="Support">
                      Existing client? I got your back, reach out here.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/guest-list">Guest List</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/registry">Registry</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/documentation">Documentation</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/pricing">Pricing</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <SignedIn>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Admin</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link href="/admin/telemetry">Telemetry</Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                          <Link href="/admin/dashboard">Dashboard</Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </SignedIn>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-violet-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/guest-list"
                  className="text-lg font-medium hover:text-violet-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Guest List
                </Link>
                <Link
                  href="/registry"
                  className="text-lg font-medium hover:text-violet-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Registry
                </Link>
                <Link
                  href="/documentation"
                  className="text-lg font-medium hover:text-violet-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Documentation
                </Link>
                <Link
                  href="/pricing"
                  className="text-lg font-medium hover:text-violet-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Pricing
                </Link>
                <SignedIn>
                  <Link
                    href="/admin/telemetry"
                    className="text-lg font-medium hover:text-violet-700 transition"
                    onClick={() => setOpen(false)}
                  >
                    Admin
                  </Link>
                </SignedIn>
                <div className="border-t pt-4 mt-2">
                  <SignedIn>
                    <div className="flex items-center gap-2">
                      <UserButton />
                      <span className="text-sm text-gray-600">
                        Your account
                      </span>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button className="w-full px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Mobile Auth */}
        <div className="md:hidden flex items-center gap-2">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1.5 text-sm rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

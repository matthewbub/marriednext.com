"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
      <div className="mx-auto flex items-center md:items-end justify-between h-16 pb-4 bg-white border-b">
        {/* Desktop Navigation */}
        <div className="hidden md:block px-4">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/engaged">Dashboard</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/engaged/guest-list">Guest List</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/engaged/settings">Settings</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/engaged/permissions">Permissions</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden px-4">
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
                <SignedIn>
                  <Link
                    href="/engaged/settings"
                    className="text-lg font-medium hover:text-violet-700 transition"
                    onClick={() => setOpen(false)}
                  >
                    Settings
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
                    <Link href="/sign-in">
                      <button className="w-full px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                        Sign In
                      </button>
                    </Link>
                  </SignedOut>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4 pr-4">
          <div className={navigationMenuTriggerStyle()}>
            <Link href="/documentation">Documentation</Link>
          </div>

          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <button className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                Sign In
              </button>
            </Link>
          </SignedOut>
        </div>

        {/* Mobile Auth */}
        <div className="md:hidden flex items-center gap-2 pr-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <button className="px-3 py-1.5 text-sm rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                Sign In
              </button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

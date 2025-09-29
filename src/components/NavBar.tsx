"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function NavBar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-20">
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-6 bg-white/70 backdrop-blur-md border-b border-white/40 rounded-b-2xl shadow-lg">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide text-gray-900 hover:text-violet-700 transition"
        >
          The Guest List
        </Link>
        <div className="flex items-center gap-6">
          <a
            className="text-sm text-gray-900 hover:text-violet-700 transition"
            href="https://yulissaandmatthew.com"
            target="_blank"
          >
            Visit Wedding Website
          </a>
          <div className="flex items-center gap-6">
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="flex gap-3">
                <SignInButton mode="modal">
                  <button className="px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  );
}

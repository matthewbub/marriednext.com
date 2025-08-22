"use client";
import Image from "next/image";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import GuestList from "@/components/GuestList";
import { useEffect, useState } from "react";
import type { Guest, Invitation } from "@/lib/types";

export default function Home() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);

  useEffect(() => {
    const fetchGuestList = async () => {
      const response = await fetch("/api/guest-list");
      const data = await response.json();
      setInvitations(data.invitations);
      setGuests(data.guests);
    };
    fetchGuestList();
  }, []);

  return (
    <div className="font-sans min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <SignedOut>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Weddings
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Please sign in to access your wedding planning dashboard.
            </p>
            <Image
              className="dark:invert mx-auto"
              src="/next.svg"
              alt="Next.js logo"
              width={180}
              height={38}
              priority
            />
          </div>
        </SignedOut>

        <SignedIn>
          <GuestList invitations={invitations} guests={guests} />
        </SignedIn>

        <SignedOut>
          <div className="text-center mt-8">
            <ol className="font-mono list-inside list-decimal text-sm/6">
              <li className="mb-2 tracking-[-.01em]">
                Sign in using the button in the top navigation
              </li>
              <li className="tracking-[-.01em]">
                Access your personalized wedding dashboard
              </li>
            </ol>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}

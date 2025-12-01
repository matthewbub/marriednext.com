"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ApplicationSeatingPlannerCore } from "component-shelf";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const STORAGE_KEY = "marriednext_seating_data";

interface Table {
  id: string;
  name: string;
  type: "circle" | "square" | "rectangle";
  seats: number;
  x: number;
  y: number;
}

interface Guest {
  id: string;
  name: string;
  tableId: string | null;
  seatPosition: number | null;
}

interface StoredData {
  tables: Table[];
  guests: Guest[];
}

export default function StandaloneSeatingPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initialData, setInitialData] = useState<StoredData | null>(null);
  const { isSignedIn } = useUser();
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredData;
        setInitialData(parsed);
      }
    } catch (e) {
      console.error("Failed to load seating data from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  const handleDataChange = (tables: Table[], guests: Guest[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables, guests }));
    } catch (e) {
      console.error("Failed to save seating data to localStorage", e);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="font-serif text-xl font-semibold text-foreground">
                Married Next
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link
                href="/templates"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <ApplicationSeatingPlannerCore
          isAuthenticated={isSignedIn}
          initialTables={initialData?.tables}
          initialGuests={initialData?.guests}
          onDataChange={handleDataChange}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" />
              <span className="font-serif text-lg font-semibold">
                Married Next
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Free wedding planning tools. No account required.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/#pricing"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                href="https://github.com"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Open Source
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

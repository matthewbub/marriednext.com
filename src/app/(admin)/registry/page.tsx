"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { StripeApiResponse, StripeTransaction } from "@/types/stripe";

// helpers
function formatUsdCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format((cents || 0) / 100);
}

function formatDateFromUnixSeconds(s: number) {
  if (!s) return "—";
  const d = new Date(s * 1000);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StripePage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);

  // Stripe query
  const {
    data: stripe,
    isLoading: stripeLoading,
    error: stripeError,
  } = useQuery<StripeApiResponse>({
    queryKey: ["stripe-data", cursor],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "100" });
      if (cursor) params.append("starting_after", cursor);

      const res = await fetch(`/api/registry?${params.toString()}`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("Failed to load Stripe data");
      return res.json();
    },
  });

  // derive stripe aggregates
  const availableUsd =
    stripe?.balance.available.find((b) => b.currency === "usd")?.amount ?? 0;
  const pendingUsd =
    stripe?.balance.pending.find((b) => b.currency === "usd")?.amount ?? 0;
  const connectReservedUsd =
    stripe?.balance.connect_reserved?.find((b) => b.currency === "usd")
      ?.amount ?? 0;

  const txns: StripeTransaction[] = stripe?.transactions.data ?? [];
  const hasMore = stripe?.transactions.has_more ?? false;
  const nextCursor = stripe?.transactions.next_starting_after;

  // Calculate some totals
  const totalGross = txns.reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const totalFees = txns.reduce((sum, t) => sum + (t.fee ?? 0), 0);
  const totalNet = txns.reduce((sum, t) => sum + (t.net ?? 0), 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <SignedIn>
        {/* Header */}
        <div className="max-w-2xl w-full mb-4 mt-20">
          <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
            <div className="mb-6">
              <h1 className="text-5xl font-bold mb-1">Registry Fund</h1>
              <p className="text-stone-700 font-handwritten-font text-lg">
                Payment Processing & Balance
              </p>
            </div>

            {stripeLoading && (
              <p className="text-stone-600 text-center py-8">
                Loading Stripe data...
              </p>
            )}

            {stripeError && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center">
                <p className="text-red-800 font-medium">
                  Failed to load Stripe data
                </p>
                <p className="text-red-600 text-sm">
                  {stripeError instanceof Error
                    ? stripeError.message
                    : "Unknown error"}
                </p>
              </div>
            )}

            {!stripeLoading && !stripeError && (
              <>
                {/* Balance Cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center">
                    <p className="text-2xl font-semibold font-handwritten-font">
                      {formatUsdCents(availableUsd)}
                    </p>
                    <p className="text-stone-700 text-sm">Available</p>
                  </div>
                  <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center">
                    <p className="text-2xl font-semibold font-handwritten-font">
                      {formatUsdCents(pendingUsd)}
                    </p>
                    <p className="text-stone-700 text-sm">Pending</p>
                  </div>
                  <div className="rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-center">
                    <p className="text-2xl font-semibold font-handwritten-font">
                      {formatUsdCents(connectReservedUsd)}
                    </p>
                    <p className="text-stone-700 text-sm">Reserved</p>
                  </div>
                </div>

                {/* Transaction Summary */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/50 px-4 py-3 text-center">
                    <p className="text-lg font-semibold text-emerald-800">
                      {formatUsdCents(totalGross)}
                    </p>
                    <p className="text-emerald-700 text-xs">Gross Volume</p>
                  </div>
                  <div className="rounded-xl bg-amber-50/50 border border-amber-200/50 px-4 py-3 text-center">
                    <p className="text-lg font-semibold text-amber-800">
                      {formatUsdCents(totalFees)}
                    </p>
                    <p className="text-amber-700 text-xs">Total Fees</p>
                  </div>
                  <div className="rounded-xl bg-blue-50/50 border border-blue-200/50 px-4 py-3 text-center">
                    <p className="text-lg font-semibold text-blue-800">
                      {formatUsdCents(totalNet)}
                    </p>
                    <p className="text-blue-700 text-xs">Net Revenue</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Transactions List */}
        {!stripeLoading && !stripeError && (
          <div className="max-w-2xl w-full mb-6">
            <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <span className="text-sm text-stone-600">
                  {txns.length} transaction{txns.length !== 1 ? "s" : ""}
                </span>
              </div>

              <ul className="divide-y divide-white/10">
                {txns.length === 0 && (
                  <li className="py-8 text-center text-stone-600">
                    No transactions found
                  </li>
                )}
                {txns.map((t) => {
                  const fee = t.fee ?? 0;
                  const net = t.net ?? 0;
                  const gross = t.amount ?? 0;

                  // Simplified display label
                  const displayLabel =
                    t.product_names && t.product_names.length > 0
                      ? t.product_names.join(", ")
                      : t.description || "Payment";

                  return (
                    <li
                      key={t.id}
                      className="py-4 flex items-start justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-base mb-1">
                          {displayLabel}
                        </p>

                        {/* Customer Information */}
                        {(t.customer_name || t.customer_email) && (
                          <p className="text-sm text-stone-700 mb-1">
                            {t.customer_name || t.customer_email}
                          </p>
                        )}

                        <p className="text-xs text-stone-500">
                          {formatDateFromUnixSeconds(t.created)}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-semibold text-gray-900">
                          {formatUsdCents(gross)}
                        </p>
                        <p className="text-xs text-stone-500">
                          {formatUsdCents(fee)} fees
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Pagination Controls */}
              {(hasMore || cursor) && (
                <div className="mt-6 flex gap-3 justify-center">
                  {cursor && (
                    <button
                      onClick={() => setCursor(undefined)}
                      className="px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 text-gray-900 border border-white/40 transition font-medium"
                    >
                      ← First Page
                    </button>
                  )}
                  {hasMore && nextCursor && (
                    <button
                      onClick={() => setCursor(nextCursor)}
                      className="px-4 py-2 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition font-medium"
                    >
                      Load More →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="max-w-2xl w-full mb-[100vh]">
          <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900 flex gap-2">
            <span className="font-handwritten-font hover:text-violet-800 cursor-default">
              Payment processing for our special day, April 23rd, 2026
            </span>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="max-w-2xl w-full mb-4 mt-20">
          <div className="p-6 bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg text-gray-900">
            <div className="my-6">
              <p className="text-stone-700 font-handwritten-font text-2xl text-center">
                Please sign in to view Stripe data.
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

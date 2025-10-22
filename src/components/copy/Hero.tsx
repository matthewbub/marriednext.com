"use client";

import Link from "next/link";
import clsx from "clsx";
import { Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

const navigation = [
  { name: "Product", href: "/#product" },
  { name: "Templates", href: "/#templates" },
  { name: "Documentation", href: "/documentation/invitations" },
  { name: "Pricing", href: "/#pricing" },
];

export default function Hero() {
  return (
    <div className={clsx("w-full bg-white dark:bg-gray-900")}>
      <header className={clsx("absolute inset-x-0 top-0 z-50")}>
        <nav
          aria-label="Global"
          className={clsx("flex items-center justify-between p-6 lg:px-8")}
        >
          <div className={clsx("flex lg:flex-1")}>
            <Link href="/" className={clsx("-m-1.5 p-1.5")}>
              <span className={clsx("text-2xl font-bold")}>Married Next</span>
            </Link>
          </div>
          <div className={clsx("flex lg:hidden")}>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className={clsx(
                    "-m-2.5 p-2.5 text-gray-500 dark:text-gray-400"
                  )}
                >
                  <span className="sr-only">Open main menu</span>
                  <Menu aria-hidden="true" className={clsx("size-6")} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className={clsx(
                  "bg-white dark:bg-gray-900 sm:max-w-sm w-full p-6"
                )}
              >
                <div className={clsx("flex items-center justify-between")}>
                  <Link href="/" className={clsx("-m-1.5 p-1.5")}>
                    <span className="sr-only">Married Next</span>
                    <span className={clsx("text-xl font-bold")}>
                      Married Next
                    </span>
                  </Link>
                </div>
                <div className={clsx("mt-6 flow-root")}>
                  <div
                    className={clsx(
                      "-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/25"
                    )}
                  >
                    <div className={clsx("space-y-2 py-6")}>
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={clsx(
                            "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className={clsx("py-6")}>
                      <Link
                        href="/admin"
                        className={clsx(
                          "-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                        )}
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div className={clsx("hidden lg:flex lg:gap-x-12")}>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "text-sm/6 font-semibold text-gray-900 dark:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div
            className={clsx(
              "hidden lg:flex lg:flex-1 lg:justify-end items-center gap-2"
            )}
          >
            <Link
              href="/admin"
              className={clsx(
                "text-sm/6 font-semibold text-gray-900 dark:text-white flex items-center gap-1"
              )}
            >
              Log in{" "}
              <ArrowRight className={clsx("h-4 w-4")} aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>

      <div className={clsx("relative isolate overflow-hidden pt-14")}>
        <img
          alt=""
          src="https://w5z4pkjtzs.ufs.sh/f/VWhha3K5W38hqGZ431kbNFwCOUBcV9rSTRkoEipGHlMfzyj0"
          className={clsx(
            "absolute inset-0 -z-10 size-full object-cover not-dark:hidden"
          )}
        />
        <img
          alt=""
          src="https://w5z4pkjtzs.ufs.sh/f/VWhha3K5W38hqGZ431kbNFwCOUBcV9rSTRkoEipGHlMfzyj0"
          className={clsx(
            "absolute inset-0 -z-10 size-full object-cover opacity-10 dark:hidden"
          )}
        />
        <div
          aria-hidden="true"
          className={clsx(
            "absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          )}
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className={clsx(
              "relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
            )}
          />
        </div>
        <div className={clsx("mx-auto w-full px-6 lg:px-8")}>
          <div className={clsx("mx-auto max-w-2xl py-32 sm:py-48 lg:py-56")}>
            <div className={clsx("hidden sm:mb-8 sm:flex sm:justify-center")}>
              <div
                className={clsx(
                  "relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:text-gray-400 dark:ring-white/10 dark:hover:ring-white/20"
                )}
              >
                New: RSVP tracking and guest list tools
                <Link
                  href="/documentation/invitations"
                  className={clsx(
                    "font-semibold text-indigo-600 dark:text-indigo-400 ml-1"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx("absolute inset-0")}
                  />
                  Read more <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
            <div className={clsx("text-center")}>
              <h1
                className={clsx(
                  "text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white"
                )}
              >
                Build a beautiful wedding website in minutes
              </h1>
              <p
                className={clsx(
                  "mt-8 text-lg font-medium text-pretty text-gray-600 sm:text-xl/8 dark:text-gray-400"
                )}
              >
                Married Next helps you share your story, collect RSVPs, manage
                guest lists, and keep everyone in the loop.
              </p>
              <div
                className={clsx(
                  "mt-10 flex items-center justify-center gap-x-6"
                )}
              >
                <Button asChild>
                  <Link href="/admin/onboarding">Start free</Link>
                </Button>
                <Button
                  asChild
                  variant="link"
                  className={clsx("text-gray-900 dark:text-white")}
                >
                  <Link
                    href="/documentation/invitations"
                    className={clsx("flex items-center gap-1")}
                  >
                    Learn more{" "}
                    <ArrowRight
                      className={clsx("h-4 w-4")}
                      aria-hidden="true"
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className={clsx(
            "absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          )}
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className={clsx(
              "relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
            )}
          />
        </div>
      </div>
    </div>
  );
}

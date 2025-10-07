"use client";

// import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

// export default function NavBar() {
//   return (
//     <nav className="w-full fixed top-0 left-0 z-20">
//       <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-6 bg-white/70 backdrop-blur-md border-b border-white/40 rounded-b-2xl shadow-lg">
//         <div className="flex items-center gap-4">
//           <a
//             className="text-sm text-gray-900 hover:text-violet-700 transition hover:underline"
//             href="https://yulissaandmatthew.com"
//             target="_blank"
//           >
//             Visit Website &#8599;
//           </a>
//           <SignedIn>
//             <Link
//               href="/registry"
//               className="text-sm text-gray-900 hover:text-violet-700 transition hover:underline"
//             >
//               Registry
//             </Link>
//           </SignedIn>
//         </div>
//         <div className="flex items-center gap-6">
//           <SignedIn>
//             <UserButton />
//           </SignedIn>

//           <SignedOut>
//             <div className="flex gap-3">
//               <SignInButton mode="modal">
//                 <button className="px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white transition">
//                   Sign In
//                 </button>
//               </SignInButton>
//             </div>
//           </SignedOut>
//         </div>
//       </div>
//     </nav>
//   );
// }

import * as React from "react";
import Link from "next/link";
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Guest List",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Registry",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Contact",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "About",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export default function NavBar() {
  return (
    <NavigationMenu viewport={false} className="py-2 z-10 relative">
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
                    <div className="mt-4 mb-2 text-lg font-medium">
                      Weddings by Mat!
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Artisan wedding websites made with love
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
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/guest-list">Guest List</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/registry">Registry</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/documentation">Documentation</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
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

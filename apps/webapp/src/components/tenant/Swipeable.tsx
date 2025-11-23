"use client";

import { useSwipeable } from "react-swipeable";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  "/",
  "/our-story",
  "/photos",
  "/wedding-party",
  "/q-and-a",
  "/travel",
  "/registry",
];

export default function Swipeable({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const swipeableHandlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = navItems.indexOf(pathname);
      if (currentIndex === navItems.length - 1) {
        // push to the first page if the current page is the last page
        router.push(navItems[0]);
      } else {
        // push to the next page
        router.push(navItems[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      const currentIndex = navItems.indexOf(pathname);
      if (currentIndex === 0) {
        // push to the last page
        router.push(navItems[navItems.length - 1]);
      } else {
        // push to the previous page
        router.push(navItems[currentIndex - 1]);
      }
    },
  });

  return (
    <div {...swipeableHandlers} className="w-full">
      {children}
    </div>
  );
}

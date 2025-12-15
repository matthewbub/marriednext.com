"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  ApplicationDashboardLayout,
  ApplicationSeatingPlannerCore,
} from "component-shelf";
import { ComingSoonOverlay } from "component-shelf";

export default function SeatingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <ApplicationDashboardLayout
      Link={Link}
      pathname={pathname}
      onLogout={() => signOut({ redirectUrl: "/" })}
      onInviteClick={() => router.push("/v2/engaged/permissions")}
    >
      {/* <ApplicationSeatingPlannerCore isAuthenticated={true} /> */}
      <ComingSoonOverlay />
    </ApplicationDashboardLayout>
  );
}

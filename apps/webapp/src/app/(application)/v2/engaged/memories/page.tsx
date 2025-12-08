"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  ApplicationMemoriesGallery,
  ApplicationDashboardLayout,
} from "component-shelf";

export default function MemoriesPage() {
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
      <ApplicationMemoriesGallery />
    </ApplicationDashboardLayout>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";
import {
  ApplicationDashboardLayout,
  ApplicationDashboardOverview,
} from "component-shelf";
import { fetchShell, fetchHomeStats } from "fetch-shelf";
import {
  transformShellToUserData,
  transformShellToWeddingData,
  transformHomeStatsToOverviewData,
} from "transformer-shelf";

export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  const { data: shellData } = useQuery({
    queryKey: ["shell"],
    queryFn: fetchShell,
  });

  const { data: homeStatsData, isLoading } = useQuery({
    queryKey: ["home-stats"],
    queryFn: fetchHomeStats,
  });

  const overviewData =
    homeStatsData && shellData
      ? transformHomeStatsToOverviewData(homeStatsData, shellData)
      : undefined;
  const userData = shellData ? transformShellToUserData(shellData) : undefined;
  const weddingData = shellData
    ? transformShellToWeddingData(shellData)
    : undefined;

  return (
    <ApplicationDashboardLayout
      user={userData}
      wedding={weddingData}
      Link={Link}
      pathname={pathname}
      onLogout={() => signOut({ redirectUrl: "/" })}
      onInviteClick={() => router.push("/engaged/permissions")}
    >
      <ApplicationDashboardOverview data={overviewData} isLoading={isLoading} />
    </ApplicationDashboardLayout>
  );
}

import { Canvas } from "@/components/seating-planner/Canvas";
import { TablesSidebar } from "@/components/seating-planner/TablesSidebar";
import { UserButton } from "@clerk/nextjs";
import { EngagedShell } from "component-shelf";

export default function SeatingPlannerPage() {
  return (
    <EngagedShell userButton={<UserButton />}>
      <div className="flex gap-6 min-h-[60vh] mx-auto max-w-7xl">
        <TablesSidebar />
        <Canvas />
      </div>
    </EngagedShell>
  );
}

import { Canvas } from "@/components/seating-planner/Canvas";
import { TablesSidebar } from "@/components/seating-planner/TablesSidebar";

export default function SeatingPlannerPage() {
  return (
    <div className="flex gap-6 min-h-[60vh] mx-auto max-w-7xl">
      <TablesSidebar />
      <Canvas />
    </div>
  );
}

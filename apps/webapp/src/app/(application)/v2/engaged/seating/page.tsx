import {
  ApplicationDashboardLayout,
  ApplicationSeatingPlannerCore,
} from "component-shelf";

export default function SeatingPage() {
  return (
    <ApplicationDashboardLayout>
      <ApplicationSeatingPlannerCore isAuthenticated={true} />
    </ApplicationDashboardLayout>
  );
}

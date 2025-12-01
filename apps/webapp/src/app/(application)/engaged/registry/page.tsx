import { EngagedShell } from "component-shelf";
import { UserButton } from "@clerk/nextjs";

export default function RegistryPage() {
  return (
    <EngagedShell userButton={<UserButton />}>
      <h1>Registry</h1>
      <p>Coming soon...</p>
    </EngagedShell>
  );
}

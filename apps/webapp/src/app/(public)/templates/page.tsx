import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationTemplatesHero,
  ApplicationTemplatesGrid,
  ApplicationTemplatesCta,
} from "component-shelf";

import { useUser } from "@clerk/nextjs";

export const metadata = {
  title: "Wedding Website Templates | Married Next",
  description:
    "Browse beautiful, customizable wedding website templates. Free and premium designs to match your unique style.",
};

export default function TemplatesPage() {
  const { isSignedIn } = useUser();
  return (
    <main className="min-h-screen">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationTemplatesHero />
      <ApplicationTemplatesGrid />
      <ApplicationTemplatesCta />
      <ApplicationFooter />
    </main>
  );
}

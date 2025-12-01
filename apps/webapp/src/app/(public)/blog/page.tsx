import { useUser } from "@clerk/nextjs";
import {
  ApplicationNavbar,
  ApplicationFooter,
  ApplicationBlogHome,
} from "component-shelf";

export const metadata = {
  title: "Wedding Planning Blog | Married Next",
  description:
    "Tips, guides, and inspiration for planning your perfect wedding. From registry etiquette to seating arrangements, we've got you covered.",
};

export default function BlogPage() {
  const { isSignedIn } = useUser();
  return (
    <main className="min-h-screen bg-background">
      <ApplicationNavbar isAuthenticated={isSignedIn} />
      <ApplicationBlogHome />
      <ApplicationFooter />
    </main>
  );
}

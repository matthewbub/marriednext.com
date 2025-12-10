import { Metadata } from "next";
import { RemoveCollaboratorPageClient } from "./RemoveCollaboratorPageClient";

const title =
  "How Do I Remove Someone From My Wedding Website | Help Center | Married Next";
const description =
  "Learn how to remove a collaborator's access to your wedding website and guest list, or revoke a pending invitation.";
const url = "https://marriednext.com/help/remove-collaborator";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    title,
    description,
    url,
    siteName: "Married Next",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Remove a Collaborator From Your Wedding Website",
  description,
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Sign in to Your Account",
      text: "Sign in to your MarriedNext account at marriednext.com.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Go to My Wedding",
      text: 'Navigate to your wedding dashboard by selecting "My Wedding" from the main navigation.',
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Open the Permissions Panel",
      text: 'Select your user icon from the navigation menu, then choose the "Invite Co-Planner" button.',
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Find the Collaborator",
      text: 'Scroll down to the "Collaborators" section to see everyone with access.',
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Open the Options Menu",
      text: "Click the three-dot menu next to the collaborator you want to remove.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Remove Collaborator",
      text: 'Select "Remove Collaborator" from the dropdown and confirm in the dialog.',
    },
  ],
};

export default function RemoveCollaboratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RemoveCollaboratorPageClient />
    </>
  );
}

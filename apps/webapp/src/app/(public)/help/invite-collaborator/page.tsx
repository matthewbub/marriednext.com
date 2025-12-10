import { Metadata } from "next";
import { InviteCollaboratorPageClient } from "./InviteCollaboratorPageClient";

const title =
  "How Do I Invite My Spouse To My Wedding Website | Help Center | Married Next";
const description =
  "Learn how to invite your partner or co-planner to help manage your wedding website and guest list together.";
const url = "https://marriednext.com/help/invite-collaborator";

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
  name: "How to Invite Your Spouse or Co-Planner to Your Wedding Website",
  description,
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Sign in or Create an Account",
      text: "Sign in to your MarriedNext account or create a new one at marriednext.com.",
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
      name: "Open Invite Co-Planner",
      text: 'Select your user icon from the navigation menu, then choose the "Invite Co-Planner" button.',
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Invite a Collaborator",
      text: 'Select the "Invite Collaborator" button in the top right corner of the permissions panel.',
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Enter Their Email Address",
      text: "Provide your collaborator's email address in the form and submit the invitation.",
    },
  ],
};

export default function InviteCollaboratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <InviteCollaboratorPageClient />
    </>
  );
}

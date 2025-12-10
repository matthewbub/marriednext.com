import { Metadata } from "next";
import { ConnectDomainPageClient } from "./ConnectDomainPageClient";

const title = "How to Connect Your Domain | Help Center | Married Next";
const description =
  "Learn how to connect your own custom domain to your Married Next wedding website.";
const url = "https://marriednext.com/help/connect-domain";

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
  name: "How to Connect Your Custom Domain to Your Wedding Website",
  description,
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "49",
  },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Add Your Domain in Settings",
      text: "Go to Dashboard → Settings and scroll down to the Domain Settings section. Enter your domain name and click Add Domain.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Configure Your DNS Records",
      text: "Log in to your domain registrar and navigate to DNS settings. Add an A record pointing to 76.76.21.21 or configure nameservers.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Wait for Verification",
      text: "Return to your Settings page. DNS verification usually takes a few minutes but can take up to 48 hours.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Done",
      text: "Once verified, your wedding website will be live at your custom domain with automatic SSL.",
    },
  ],
};

export default function ConnectDomainPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConnectDomainPageClient />
    </>
  );
}

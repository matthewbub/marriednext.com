import CallToAction from "@/components/copy/CallToAction";
import BasicFooter from "@/components/copy/BasicFooter";
import Hero from "@/components/copy/Hero";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";
import RsvpFeatures from "@/components/copy/RsvpFeatures";

function PublicContent() {
  return (
    <>
      <Hero />
      <RsvpFeatures />
      <CallToAction />
      <BasicFooter />
    </>
  );
}

function ProtectedContent() {
  return (
    <div className="mx-auto z-10">
      <NavBar />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <SignedOut>
        <PublicContent />
      </SignedOut>
      <SignedIn>
        <ProtectedContent />
      </SignedIn>
    </div>
  );
}

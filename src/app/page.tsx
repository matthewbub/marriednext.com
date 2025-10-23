import CallToAction from "@/components/copy/CallToAction";
import BasicFooter from "@/components/copy/BasicFooter";
import Hero from "@/components/copy/Hero";
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <PublicContent />
    </div>
  );
}

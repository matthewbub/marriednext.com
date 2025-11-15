import clsx from "clsx";
import Link from "next/link";

const navBar = [
  { label: "About Us", path: "/about-us" },
  { label: "Blog", path: "/blog" },
  { label: "Services", path: "/services" },
  { label: "Templates", path: "/templates" },
];

function PublicNavBar() {
  return (
    <nav className="bar-public-navbar bar-canvas w-full rounded-full mt-4">
      <div className="flex justify-between items-center md:w-7xl mx-auto w-full py-5">
        <h1 className="font-title text-3xl">Married Next</h1>

        <div className="flex gap-2">
          <div className="flex gap-2">
            {navBar.map((item) => (
              <Link
                href={item.path}
                key={item.path}
                className="border-b-2 border-transparent hover:border-black"
              >
                <span className="inline-block py-2 px-2.5">{item.label}</span>
              </Link>
            ))}
          </div>
          <Link href={"/register"} className="secondaryButton">
            {"Join for free"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function PublicHero() {
  return (
    <div className="bar-public-hero grid grid-cols-12">
      <div className="col-span-7">
        <h2 className="text-[64px]">
          Getting Married Has Never Been So Simple.
        </h2>
        <span className="text-2xl">
          You’re going to love what we’ve put together for your special day.{" "}
        </span>

        <div className="flex gap-2">
          <Link href={"/register"}>{"Get Started"}</Link>
          <Link href={"/explore"}>{"Explore Templates"}</Link>
        </div>
      </div>
      <div className="col-span-5">
        {/* <img /> */}
        <div>
          <span>{"Handcrafted Wedding Websites"}</span>
          <span>
            {"Open Source (Community)"}
            <span className="italic bold">{"(Community)"}</span>
          </span>
          <span>{"Version 0.0.1"}</span>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  <section className="bar-public-howitworks-section"></section>;
}

export default function Home() {
  return (
    <div className="px-4 mx:px-10">
      <PublicNavBar />
      <PublicHero />
    </div>
  );
}

import { ClipboardList, Mail, Users } from "lucide-react";
import Image from "next/image";

const features = [
  {
    name: "Invitation-based guest list",
    description:
      "Create your guest list and send personalized invitations. Each guest gets their own unique link to manage their response.",
    icon: ClipboardList,
  },
  {
    name: "RSVP for your whole party",
    description:
      "Guests can respond for themselves or on behalf of their entire party. No need to coordinate multiple responses.",
    icon: Users,
  },
  {
    name: "Stay connected with your guests",
    description:
      "Collect email addresses as an emergency contact point. Receive instant notifications when guests respond, with bulk management available in your dashboard.",
    icon: Mail,
  },
];

export default function RsvpFeatures() {
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:ml-auto lg:pt-4 lg:pl-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-indigo-600 dark:text-indigo-400">
                Effortless planning
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
                Your digital home for wedding RSVPs
              </p>
              <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
                Create a seamless experience for your guests to share in your
                celebration. Make it easy for them to respond, and give yourself
                peace of mind with organized, real-time tracking.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-indigo-600 dark:text-indigo-400"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex items-start justify-end lg:order-first">
            <Image
              alt="Wedding RSVP dashboard screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/project-app-screenshot.png"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 dark:hidden dark:ring-white/10"
            />
            <Image
              alt="Wedding RSVP dashboard screenshot"
              src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"
              width={2432}
              height={1442}
              className="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 not-dark:hidden sm:w-228 dark:ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

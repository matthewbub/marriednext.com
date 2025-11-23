import { useState, useRef, useEffect } from "react";
import { Menu, Bell, X } from "lucide-react";
import { clsx } from "clsx";
import "style-shelf/tailwind-hybrid";

const defaultUser = {
  name: "Matthew Bub",
  email: "matthew@marriednext.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
const navigation = [
  { name: "Dashboard", href: "#", current: true },
  { name: "Guest List", href: "#", current: false },
  { name: "Seating Planner", href: "#", current: false },
  { name: "Website Builder", href: "#", current: false },
  { name: "Memories", href: "#", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Permissions", href: "#" },
  { name: "Help", href: "#" },
  { name: "Sign out", href: "#" },
];

interface EngagedShellProps {
  user?: {
    name: string;
    email: string;
    imageUrl: string;
  };
  userButton?: React.ReactNode;
}

export default function EngagedShell({
  user = defaultUser,
  userButton,
}: EngagedShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <div className="mn-shell mn-engaged-shell min-h-full">
      <nav className="mn-engaged-nav">
        <div className="mn-engaged-nav-shell mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mn-engaged-nav-container flex h-16 items-center justify-between">
            <div className="mn-engaged-nav-left flex items-center">
              <h1 className="mn-engaged-nav-title">Married Next</h1>
              <div className="mn-engaged-nav-links-wrapper hidden md:block">
                <div className="mn-engaged-nav-links ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      aria-current={item.current ? "page" : undefined}
                      className={clsx(
                        "mn-engaged-nav-link",
                        "rounded-md px-3 py-2 text-sm font-medium",
                        item.current
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="mn-engaged-nav-right hidden md:block">
              <div className="mn-engaged-nav-actions ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="mn-engaged-nav-notification-button relative rounded-full p-1 focus:outline-2 focus:outline-offset-2 focus:outline-current"
                >
                  <span className="mn-engaged-nav-notification-button-inset absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <Bell aria-hidden="true" className="size-6" />
                </button>

                <div
                  className="mn-engaged-nav-profile-menu relative ml-3"
                  ref={profileMenuRef}
                >
                  {userButton ? (
                    userButton
                  ) : (
                    <>
                      <button
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        className="mn-engaged-nav-profile-button relative flex max-w-xs items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                      >
                        <span className="mn-engaged-nav-profile-button-inset absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          alt=""
                          src={user.imageUrl}
                          className="mn-engaged-nav-profile-image size-8 rounded-full outline -outline-offset-1 outline-black/10"
                        />
                      </button>

                      {profileMenuOpen && (
                        <div className="mn-engaged-nav-profile-dropdown absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline-1 outline-black/5">
                          {userNavigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="mn-engaged-nav-profile-dropdown-link block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              {item.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="mn-engaged-nav-mobile-toggle -mr-2 flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mn-engaged-nav-mobile-button relative inline-flex items-center justify-center rounded-md p-2 hover:bg-gray-100 focus:outline-2 focus:outline-offset-2 focus:outline-current"
              >
                <span className="mn-engaged-nav-mobile-button-inset absolute -inset-0.5" />
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X aria-hidden="true" className="size-6" />
                ) : (
                  <Menu aria-hidden="true" className="size-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mn-engaged-nav-mobile-menu md:hidden">
            <div className="mn-engaged-nav-mobile-links space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={clsx(
                    "mn-engaged-nav-mobile-link",
                    "block rounded-md px-3 py-2 text-base font-medium",
                    item.current
                      ? "bg-gray-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="mn-engaged-nav-mobile-user border-t border-gray-200 pt-4 pb-3">
              <div className="mn-engaged-nav-mobile-user-info flex items-center px-5">
                <div className="mn-engaged-nav-mobile-user-avatar shrink-0">
                  <img
                    alt=""
                    src={user.imageUrl}
                    className="mn-engaged-nav-mobile-user-avatar-img size-10 rounded-full outline -outline-offset-1 outline-black/10"
                  />
                </div>
                <div className="mn-engaged-nav-mobile-user-details ml-3">
                  <div className="mn-engaged-nav-mobile-user-name text-base font-medium">
                    {user.name}
                  </div>
                  <div className="mn-engaged-nav-mobile-user-email text-sm font-medium">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="mn-engaged-nav-mobile-notification-button relative ml-auto shrink-0 rounded-full p-1 text-gray-400 hover:text-black focus:outline-2 focus:outline-offset-2 focus:outline-current"
                >
                  <span className="mn-engaged-nav-mobile-notification-button-inset absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <Bell aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="mn-engaged-nav-mobile-user-links mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="mn-engaged-nav-mobile-user-link block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-100"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <header className="mn-engaged-header relative bg-white shadow-sm">
        <div className="mn-engaged-header-shell mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="mn-engaged-header-title text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="mn-engaged-main">
        <div className="mn-engaged-main-shell mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"></div>
      </main>
    </div>
  );
}

"use client";

import "style-shelf/tailwind";
import { Globe, Lock, ExternalLink } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";

interface DomainStatusProps {
  subdomain: string;
  customDomain: string;
  isPremium: boolean;
}

export function DomainStatus({
  subdomain: initialSubdomain,
  customDomain,
}: DomainStatusProps) {
  const [subdomain, setSubdomain] = useState(initialSubdomain);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="rounded-xl bg-[#f5f3eb] p-6 border border-[#2c2c2c]/10">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-[#745656]/10 p-2.5 rounded-full">
          <Globe className="h-5 w-5 text-[#745656]" />
        </div>
        <h2 className="font-serif text-2xl text-[#2c2c2c]">
          Your Wedding Website
        </h2>
      </div>

      <p className="font-sans text-base text-[#2c2c2c]/70 mb-6 ml-[52px]">
        This is the web address your guests will visit to RSVP and see your
        wedding details. Share this link in your invitations!
      </p>

      <div className="space-y-4">
        {/* Free Subdomain */}
        <div className="bg-white/60 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="font-sans text-base text-[#2c2c2c]/70">
                Live and ready to share
              </span>
            </div>
            <span className="font-sans text-sm bg-[#745656]/10 text-[#745656] px-3 py-1 rounded-full">
              Free
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isEditing ? (
              <>
                <Input
                  value={subdomain}
                  onChange={(e) =>
                    setSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "")
                    )
                  }
                  className="flex-1 min-w-[150px] bg-white border-[#745656]/30 font-sans text-base h-11"
                />
                <span className="font-sans text-base text-[#2c2c2c]/70">
                  .marriednext.com
                </span>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-[#745656] hover:bg-[#8e6a6a] text-white font-sans text-base rounded-full h-11 px-5"
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <span className="font-sans text-lg text-[#2c2c2c]">
                  {subdomain}.marriednext.com
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-[#745656] hover:bg-[#745656]/10 font-sans text-base"
                >
                  Edit
                </Button>
                <a
                  href={`https://${subdomain}.marriednext.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#745656] hover:text-[#8e6a6a] p-2"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </>
            )}
          </div>
        </div>

        {/* Custom Domain (Locked) */}
        <div className="bg-[#2c2c2c]/5 rounded-lg p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#2c2c2c]/5 backdrop-blur-[1px]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-[#2c2c2c]/40" />
                <span className="font-sans text-base text-[#2c2c2c]/50">
                  Use Your Own Domain
                </span>
              </div>
              <span className="font-sans text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                Premium
              </span>
            </div>

            <p className="font-sans text-base text-[#2c2c2c]/40 mb-4">
              Want a custom address like {customDomain}? Upgrade to Premium to
              use your own domain name.
            </p>

            <Button className="bg-[#745656] hover:bg-[#8e6a6a] text-white font-sans text-base rounded-full h-11 px-6">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

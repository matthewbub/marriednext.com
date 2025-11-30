"use client";

import "style-shelf/tailwind";
import { Users, UserPlus, LayoutGrid, Send } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";

interface QuickActionsProps {
  contributorCount: number;
}

export function QuickActions({ contributorCount }: QuickActionsProps) {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    // Handle invite logic
    setEmail("");
  };

  return (
    <div className="space-y-4">
      {/* Seating Planner CTA */}
      <div className="rounded-xl bg-[#745656] p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl mb-2">Seating Planner</h3>
            <p className="font-sans text-base text-white/80 mb-5">
              Organize your tables and arrange guests for the perfect seating
              arrangement.
            </p>
            <a href="/dashboard/seating">
              <Button className="bg-white text-[#745656] hover:bg-white/90 font-sans text-base rounded-full px-6 py-2 h-auto">
                Plan Seating
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Invite Collaborators CTA - Added email input field */}
      <div className="rounded-xl bg-[#f5f3eb] p-6 border border-[#2c2c2c]/10">
        <div className="flex items-start gap-4">
          <div className="bg-[#745656]/10 p-3 rounded-full">
            <UserPlus className="h-5 w-5 text-[#745656]" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-xl text-[#2c2c2c] mb-2">
              Invite Collaborators
            </h3>
            <p className="font-sans text-base text-[#2c2c2c]/70 mb-4">
              Invite your partner, wedding planner, or friends to help plan your
              big day.
            </p>

            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-[#2c2c2c]/20 font-sans text-base h-11"
              />
              <Button
                onClick={handleInvite}
                className="bg-[#745656] hover:bg-[#8e6a6a] text-white font-sans text-base rounded-full px-5 h-11"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>

            <div className="flex items-center gap-2 text-[#2c2c2c]/60">
              <Users className="h-4 w-4" />
              <span className="font-sans text-base">
                {contributorCount} contributors
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import "style-shelf/tailwind";
import { ImageIcon, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "../../components/ui/button";

const mockMedia = [
  {
    id: 1,
    url: "/wedding-couple-romantic-sunset-photo.jpg",
    alt: "Wedding couple romantic sunset",
  },
  {
    id: 2,
    url: "/engagement-ring-closeup-elegant.jpg",
    alt: "Engagement ring closeup",
  },
  {
    id: 3,
    url: "/wedding-venue-outdoor-garden-ceremony.jpg",
    alt: "Outdoor garden ceremony",
  },
  {
    id: 4,
    url: "/bride-groom-first-dance-reception.jpg",
    alt: "First dance at reception",
  },
  { id: 5, url: "/wedding-bouquet-flowers.jpg", alt: "Wedding bouquet" },
  { id: 6, url: "/elegant-wedding-cake.png", alt: "Wedding cake" },
];

const usedStorage = 42;
const maxStorage = 50;
const percentUsed = (usedStorage / maxStorage) * 100;

export function MediaGallery() {
  return (
    <div className="rounded-xl bg-white p-6 border border-[#2c2c2c]/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-[#745656]/10 p-2.5 rounded-full">
            <ImageIcon className="h-5 w-5 text-[#745656]" />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-[#2c2c2c]">Guest Media</h2>
            <p className="font-sans text-base text-[#2c2c2c]/60">
              28 photos uploaded by your guests
            </p>
          </div>
        </div>

        <a href="/dashboard/media">
          <Button className="bg-[#745656] hover:bg-[#8e6a6a] text-white font-sans text-base rounded-full px-6 h-11">
            View All Photos
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {mockMedia.map((media) => (
          <div
            key={media.id}
            className="relative aspect-square rounded-xl overflow-hidden bg-[#2c2c2c]/5 group cursor-pointer"
          >
            <img
              src={media.url || "/placeholder.svg"}
              alt={media.alt}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-sans text-lg font-semibold text-amber-800">
                Running Low on Storage
              </h3>
              <span className="font-sans text-base font-medium text-amber-700">
                {usedStorage} / {maxStorage} photos
              </span>
            </div>
            <p className="font-sans text-base text-amber-700 mb-3">
              You're almost at your photo limit. Once full, new uploads from
              guests won't be saved and you may miss out on special moments from
              your big day.
            </p>
            {/* Progress bar */}
            <div className="w-full bg-amber-200 rounded-full h-2.5 mb-3">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white font-sans text-base rounded-full px-5 h-10">
              Upgrade for Unlimited Photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

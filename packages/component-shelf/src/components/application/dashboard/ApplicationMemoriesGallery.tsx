"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import {
  Camera,
  Upload,
  X,
  Download,
  Trash2,
  Share2,
  AlertTriangle,
  Sparkles,
  Cloud,
  Lock,
  Check,
  ZoomIn,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for photos
const mockPhotos = [
  {
    id: 1,
    src: "/wedding-couple-dancing-first-dance.jpg",
    uploadedBy: "Sarah",
    date: "Nov 20, 2025",
    likes: 12,
  },
  {
    id: 2,
    src: "/wedding-ceremony-outdoor-garden.jpg",
    uploadedBy: "Michael",
    date: "Nov 20, 2025",
    likes: 24,
  },
  {
    id: 3,
    src: "/wedding-cake-elegant-white-flowers.jpg",
    uploadedBy: "Emma (Guest)",
    date: "Nov 21, 2025",
    likes: 8,
  },
  {
    id: 4,
    src: "/wedding-bouquet-roses-pink.jpg",
    uploadedBy: "Sarah",
    date: "Nov 20, 2025",
    likes: 15,
  },
  {
    id: 5,
    src: "/wedding-rings-gold-elegant.jpg",
    uploadedBy: "Photographer",
    date: "Nov 22, 2025",
    likes: 31,
  },
  {
    id: 6,
    src: "/wedding-guests-celebrating-party.jpg",
    uploadedBy: "James (Guest)",
    date: "Nov 21, 2025",
    likes: 6,
  },
  {
    id: 7,
    src: "/bride-getting-ready-mirror.jpg",
    uploadedBy: "Sarah",
    date: "Nov 20, 2025",
    likes: 19,
  },
  {
    id: 8,
    src: "/groom-nervous-waiting-altar.jpg",
    uploadedBy: "Best Man",
    date: "Nov 20, 2025",
    likes: 11,
  },
  {
    id: 9,
    src: "/wedding-venue-decorated-fairy-lights.jpg",
    uploadedBy: "Michael",
    date: "Nov 19, 2025",
    likes: 22,
  },
];

// Storage simulation
const storageUsed = 420; // MB
const storageFree = 500; // MB limit for free tier
const storagePremium = 10000; // MB (10GB) for premium

export function ApplicationMemoriesGallery() {
  const [photos, setPhotos] = useState(mockPhotos);
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<
    (typeof mockPhotos)[0] | null
  >(null);
  const [filter, setFilter] = useState<"all" | "mine" | "guests">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storagePercentage = (storageUsed / storageFree) * 100;
  const isNearLimit = storagePercentage >= 80;
  const isAtLimit = storagePercentage >= 100;

  const filteredPhotos = photos.filter((photo) => {
    if (filter === "mine")
      return photo.uploadedBy === "Sarah" || photo.uploadedBy === "Michael";
    if (filter === "guests")
      return (
        photo.uploadedBy.includes("Guest") ||
        photo.uploadedBy === "Photographer" ||
        photo.uploadedBy === "Best Man"
      );
    return true;
  });

  const togglePhotoSelection = (id: number) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Memories
          </h1>
          <p className="text-muted-foreground mt-1">
            Collect and share photos from your special day
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isSelecting ? (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedPhotos.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedPhotos([]);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={selectedPhotos.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelecting(true)}
              >
                Select
              </Button>
              <Button size="sm" onClick={handleUploadClick}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
              />
            </>
          )}
        </div>
      </div>

      {/* Storage Warning Banner - Show when near limit */}
      {isNearLimit && (
        <Card
          className={cn(
            "border-2",
            isAtLimit
              ? "border-destructive bg-destructive/5"
              : "border-amber-500 bg-amber-50"
          )}
        >
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    isAtLimit ? "bg-destructive/10" : "bg-amber-100"
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-5 w-5",
                      isAtLimit ? "text-destructive" : "text-amber-600"
                    )}
                  />
                </div>
                <div>
                  <h3
                    className={cn(
                      "font-medium",
                      isAtLimit ? "text-destructive" : "text-amber-800"
                    )}
                  >
                    {isAtLimit
                      ? "Storage Limit Reached"
                      : "Running Low on Storage"}
                  </h3>
                  <p
                    className={cn(
                      "text-sm mt-1",
                      isAtLimit ? "text-destructive/80" : "text-amber-700"
                    )}
                  >
                    {isAtLimit
                      ? "You've used all your free storage. You can still upload photos and we'll keep them safe, but you won't be able to view or download new uploads until you upgrade."
                      : `You're using ${storagePercentage.toFixed(
                          0
                        )}% of your free storage. Upgrade to Premium for 10GB of storage.`}
                  </p>
                  {isAtLimit && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      <span>
                        Your photos are safely stored and will be accessible
                        after upgrading
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                className={cn(
                  "shrink-0",
                  isAtLimit
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-amber-600 hover:bg-amber-700 text-white"
                )}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Storage & Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-semibold">{storageUsed} MB</span>
                <span className="text-sm text-muted-foreground">
                  of {storageFree} MB
                </span>
              </div>
              <Progress
                value={Math.min(storagePercentage, 100)}
                className={cn(
                  "h-2",
                  isAtLimit
                    ? "[&>div]:bg-destructive"
                    : isNearLimit
                    ? "[&>div]:bg-amber-500"
                    : ""
                )}
              />
              <p className="text-xs text-muted-foreground">
                {isAtLimit
                  ? "Upgrade for 10GB storage"
                  : `${storageFree - storageUsed} MB remaining`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Total Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-semibold">{photos.length}</span>
              <Badge variant="secondary" className="text-xs">
                {
                  photos.filter(
                    (p) =>
                      p.uploadedBy.includes("Guest") ||
                      p.uploadedBy === "Best Man"
                  ).length
                }{" "}
                from guests
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share your gallery link so guests can upload too
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Guest Upload Link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-muted px-2 py-1.5 rounded truncate">
                marriednext.com/upload/sarah-michael
              </code>
              <Button variant="outline" size="sm">
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share with guests to collect their photos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upsell - Show when not at limit but as gentle reminder */}
      {!isNearLimit && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">
                    Upgrade to Premium
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get 10GB storage, priority support, and premium templates
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Show:</span>
        {(["all", "mine", "guests"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? "All Photos"
              : f === "mine"
              ? "Our Photos"
              : "Guest Photos"}
          </Button>
        ))}
      </div>

      {/* Photo Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Upload Card */}
        <button
          onClick={handleUploadClick}
          className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary"
        >
          <Upload className="h-8 w-8" />
          <span className="text-sm font-medium">Upload</span>
        </button>

        {/* Photo Cards */}
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className={cn(
              "group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
              isSelecting && selectedPhotos.includes(photo.id)
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-transparent hover:border-primary/50"
            )}
            onClick={() =>
              isSelecting
                ? togglePhotoSelection(photo.id)
                : setViewingPhoto(photo)
            }
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={`Wedding photo by ${photo.uploadedBy}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />

            {/* Selection Checkbox */}
            {isSelecting && (
              <div
                className={cn(
                  "absolute top-2 left-2 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  selectedPhotos.includes(photo.id)
                    ? "bg-primary border-primary"
                    : "bg-white/80 border-white"
                )}
              >
                {selectedPhotos.includes(photo.id) && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </div>
            )}

            {/* Hover Overlay */}
            {!isSelecting && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            )}

            {/* Photo Info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate">{photo.uploadedBy}</p>
              <div className="flex items-center gap-1 text-white/80">
                <Heart className="h-3 w-3" />
                <span className="text-xs">{photo.likes}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Lightbox */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setViewingPhoto(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={viewingPhoto.src || "/placeholder.svg"}
              alt={`Wedding photo by ${viewingPhoto.uploadedBy}`}
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
              <span className="font-medium">{viewingPhoto.uploadedBy}</span>
              <span className="mx-2">•</span>
              <span className="text-white/80">{viewingPhoto.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary">
                <Heart className="h-4 w-4 mr-2" />
                {viewingPhoto.likes}
              </Button>
              <Button size="sm" variant="secondary">
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

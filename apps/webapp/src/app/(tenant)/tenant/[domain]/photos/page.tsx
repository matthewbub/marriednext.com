import Link from "next/link";
import Image from "next/image";
import { photoGallery, proposalPhotos } from "@/lib/tenant/constants";
import {
  ObjectPosition,
  PhotoFrameProps,
  PhotoType,
  TimelineCardProps,
} from "@/lib/tenant/types";

const cn = (...args: string[]) => args.join(" ");

const PhotoFrame = ({
  src,
  alt,
  className,
  aspectRatio = "wide",
  objectPosition = "center",
}: PhotoFrameProps) => {
  const aspectClasses = {
    photo: "aspect-[4/3]",
    square: "aspect-square",
    wide: "aspect-[16/9]",
    horizontal: "aspect-[9/16]",
  };

  const positionClasses = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
    left: "object-left",
    right: "object-right",
    "top-left": "object-left-top",
    "top-right": "object-right-top",
    "bottom-left": "object-left-bottom",
    "bottom-right": "object-right-bottom",
  };

  return (
    <div
      className={cn(
        "h-[500px] w-full relative overflow-hidden bg-muted shadow-soft transition-all duration-300 group",
        aspectClasses[aspectRatio],
        className || ""
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover group-hover:scale-105 transition-transform duration-500",
          positionClasses[objectPosition]
        )}
        quality={90}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

const TimelineCard = ({
  year,
  children,
  isLast,
  className,
  style,
}: TimelineCardProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row gap-4 sm:gap-8 pb-8",
        className || ""
      )}
      style={style}
    >
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 border-2 border-background shadow-soft" />
          {!isLast && (
            <div className="w-px h-24 bg-gradient-to-b from-foreground to-foreground/0 mt-2" />
          )}
        </div>
      </div>

      {/* Year badge */}
      <div className="flex-shrink-0 self-start">
        <div className="px-4 py-2 shadow-soft">
          <span className="tracking-wider abramo-script text-[100px] leading-[32px]">
            {year}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};

export default function Photos() {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mt-12 mb-16">
          <h1 className="text-4xl md:text-5xl mb-6 ">Photos</h1>

          <p className="text-lg leading-relaxed max-w-2xl mx-auto font-light">
            A collection of our favorite moments together — from our early days
            of dating to our engagement and everything in between.
          </p>
        </div>

        <section className="mb-16">
          <div>
            {(
              Object.entries(photoGallery) as [
                string,
                [string, ObjectPosition]
              ][]
            ).map(([year, [photoUrl, objectPosition]], index) => (
              <TimelineCard
                key={year}
                year={year}
                isLast={index === Object.entries(photoGallery).length - 1}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-4">
                  <PhotoFrame
                    src={photoUrl}
                    alt={`Our memories from ${year}`}
                    aspectRatio="horizontal"
                    objectPosition={objectPosition}
                    className="mb-4"
                  />
                </div>
              </TimelineCard>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-6 ">The Proposal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(proposalPhotos as PhotoType[]).map((photo, index) => {
              const photoUrl = typeof photo === "string" ? photo : photo.url;
              const objectPosition: ObjectPosition =
                typeof photo === "string"
                  ? "center"
                  : photo.objectPosition || "center";

              const positionClasses: Record<ObjectPosition, string> = {
                center: "object-center",
                top: "object-top",
                bottom: "object-bottom",
                left: "object-left",
                right: "object-right",
                "top-left": "object-left-top",
                "top-right": "object-right-top",
                "bottom-left": "object-left-bottom",
                "bottom-right": "object-right-bottom",
              };

              return (
                <div
                  key={typeof photo === "string" ? photo : photo.url}
                  className="shadow-lg overflow-hidden border border-rose-100 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative w-full h-[500px] lg:h-[400px] bg-rose-50">
                    <Image
                      src={photoUrl || "/placeholder.svg"}
                      alt={`Proposal photo ${index + 1}`}
                      fill
                      className={cn(
                        "object-cover",
                        positionClasses[objectPosition]
                      )}
                      quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="text-center pb-12">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

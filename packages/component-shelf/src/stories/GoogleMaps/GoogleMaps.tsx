import { googleMapsDefaults } from "./GoogleMaps.constants";
import type { GoogleMapsTypes } from "./GoogleMaps.types";

export const GoogleMaps = ({
  embedUrl,
  width = googleMapsDefaults.width,
  height = googleMapsDefaults.height,
}: GoogleMapsTypes) => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: width + 2, height: height + 2 }}
    >
      <div className="rounded-lg overflow-hidden border border-gray-300 h-full w-fit">
        <iframe
          src={embedUrl}
          width={width}
          height={height}
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};


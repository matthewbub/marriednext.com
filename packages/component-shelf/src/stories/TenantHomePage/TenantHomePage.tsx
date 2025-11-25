import { tenantHomePageDefaults } from "./TenantHomePage.constants";
import type { TenantHomePageTypes } from "./TenantHomePage.types";

export const TenantHomePage = ({
  fieldNameA,
  fieldNameB,
  fieldLocationName,
  fieldLocationAddress,
  fieldMapsShareUrl,
  imageUrl = tenantHomePageDefaults.imageUrl,
  imageWidth = tenantHomePageDefaults.imageWidth,
  imageHeight = tenantHomePageDefaults.imageHeight,
  imageComponent,
  rsvpFormComponent,
}: TenantHomePageTypes) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mt-20 mb-28 md:px-0 px-4">
        {imageComponent || (
          <img
            src={imageUrl}
            alt={`${fieldNameA} and ${fieldNameB}`}
            width={imageWidth}
            height={imageHeight}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        )}
      </div>

      <div id="rsvp">{rsvpFormComponent}</div>

      {fieldLocationName && (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex flex-col items-center justify-center my-2 md:pl-4">
            <h3 className="text-2xl font-semibold abramo-serif">
              {fieldLocationName}
            </h3>
            {fieldMapsShareUrl && fieldLocationAddress && (
              <a
                href={fieldMapsShareUrl}
                target="_blank"
                className="text-lg md:text-xl text-gray-700 text-center"
              >
                {fieldLocationAddress.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < fieldLocationAddress!.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

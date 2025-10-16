"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebsiteBuilderStore } from "@/lib/stores/websiteBuilderStore";

const locationSchema = z.object({
  venueName: z.string().min(1, "Venue name is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().min(1, "Address line 2 is required"),
  mapLink: z.string().url("Must be a valid URL"),
});

type LocationFormData = z.infer<typeof locationSchema>;

export default function LocationEditor() {
  const location = useWebsiteBuilderStore((state) => state.location);
  const setLocation = useWebsiteBuilderStore((state) => state.setLocation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: location,
  });

  const onSubmit = (data: LocationFormData) => {
    setLocation(data);
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-700">
        Location
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Venue Name
          </label>
          <Input
            type="text"
            placeholder="Bel Vino Winery"
            className="text-sm"
            {...register("venueName")}
          />
          {errors.venueName && (
            <p className="text-xs text-red-600 mt-1">
              {errors.venueName.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Address Line 1
          </label>
          <Input
            type="text"
            placeholder="33515 Rancho California Road"
            className="text-sm"
            {...register("addressLine1")}
          />
          {errors.addressLine1 && (
            <p className="text-xs text-red-600 mt-1">
              {errors.addressLine1.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Address Line 2
          </label>
          <Input
            type="text"
            placeholder="Temecula, CA 92591"
            className="text-sm"
            {...register("addressLine2")}
          />
          {errors.addressLine2 && (
            <p className="text-xs text-red-600 mt-1">
              {errors.addressLine2.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Map Link
          </label>
          <Input
            type="url"
            placeholder="https://maps.app.goo.gl/..."
            className="text-sm"
            {...register("mapLink")}
          />
          {errors.mapLink && (
            <p className="text-xs text-red-600 mt-1">
              {errors.mapLink.message}
            </p>
          )}
        </div>
        <Button type="submit" size="sm" className="w-full">
          Update Location
        </Button>
      </form>
    </div>
  );
}

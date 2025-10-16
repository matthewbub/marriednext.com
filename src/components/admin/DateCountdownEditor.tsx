"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWebsiteBuilderStore } from "@/lib/stores/websiteBuilderStore";

const dateCountdownSchema = z.object({
  dateLocationText: z.string().min(1, "Date and location text is required"),
  countdownTargetUtc: z.string().refine((val) => {
    try {
      const date = new Date(val);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, "Must be a valid ISO 8601 date"),
});

type DateCountdownFormData = z.infer<typeof dateCountdownSchema>;

export default function DateCountdownEditor() {
  const dateCountdown = useWebsiteBuilderStore((state) => state.dateCountdown);
  const setDateCountdown = useWebsiteBuilderStore(
    (state) => state.setDateCountdown
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DateCountdownFormData>({
    resolver: zodResolver(dateCountdownSchema),
    defaultValues: dateCountdown,
  });

  const onSubmit = (data: DateCountdownFormData) => {
    setDateCountdown(data);
  };

  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium mb-3 uppercase tracking-wide text-gray-700">
        Date & Countdown
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Date & Location Text
          </label>
          <Input
            type="text"
            placeholder="April 24, 2026 | Temecula, California"
            className="text-sm"
            {...register("dateLocationText")}
          />
          {errors.dateLocationText && (
            <p className="text-xs text-red-600 mt-1">
              {errors.dateLocationText.message}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Countdown Target Date (UTC)
          </label>
          <Input
            type="text"
            placeholder="2026-04-24T00:00:00Z"
            className="text-sm"
            {...register("countdownTargetUtc")}
          />
          {errors.countdownTargetUtc && (
            <p className="text-xs text-red-600 mt-1">
              {errors.countdownTargetUtc.message}
            </p>
          )}
        </div>
        <Button type="submit" size="sm" className="w-full">
          Update Date & Countdown
        </Button>
      </form>
    </div>
  );
}

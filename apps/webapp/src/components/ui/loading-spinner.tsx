import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  size?: "default" | "small";
}

export function LoadingSpinner({
  message = "Loading...",
  className,
  size = "default",
}: LoadingSpinnerProps) {
  if (size === "small") {
    return (
      <div className={clsx("py-8", className)}>
        <div className="flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("container mx-auto p-8", className)}>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  className,
}: LoadingSpinnerProps) {
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

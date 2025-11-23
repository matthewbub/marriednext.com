import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface DocsCalloutProps {
  icon?: LucideIcon;
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: "info" | "warning" | "success" | "neutral";
}

export function DocsCallout({
  icon: Icon,
  title,
  children,
  variant = "neutral",
  className,
}: DocsCalloutProps) {
  const variantStyles = {
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    warning:
      "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
    success:
      "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    neutral: "bg-muted/50 border-border",
  };

  const iconStyles = {
    info: "text-blue-600 dark:text-blue-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    success: "text-green-600 dark:text-green-400",
    neutral: "text-primary",
  };

  return (
    <div
      className={`p-6 rounded-xl border mb-4 ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className={`w-5 h-5 mt-1 shrink-0 ${iconStyles[variant]}`} />
        )}
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          )}
          <div className="text-sm text-muted-foreground leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface DocsSectionProps {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function DocsSection({
  title,
  icon: Icon,
  children,
  className = "",
  id,
}: DocsSectionProps) {
  return (
    <section id={id} className={`mb-12 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-6">
          {Icon && <Icon className="w-6 h-6 text-primary" />}
          <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}

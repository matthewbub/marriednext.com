import { LucideIcon } from "lucide-react";

interface DocsHeaderProps {
  badge?: {
    icon: LucideIcon;
    text: string;
  };
  title: string;
  description: string;
}

export function DocsHeader({ badge, title, description }: DocsHeaderProps) {
  return (
    <div className="mb-12">
      {badge && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <badge.icon className="w-4 h-4" />
          {badge.text}
        </div>
      )}
      <h1 className="text-5xl font-bold text-foreground mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}

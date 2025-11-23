import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocsBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-2 mb-8 text-sm"
      aria-label="Breadcrumb"
    >
      <Link
        href="/documentation"
        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      >
        Documentation
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

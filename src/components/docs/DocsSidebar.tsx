import { ReactNode } from "react";

export interface TableOfContentsItem {
  id: string;
  title: string;
  level?: number; // 1, 2, or 3 for h1, h2, h3
}

interface DocsSidebarProps {
  items: TableOfContentsItem[];
  activeId?: string;
}

export function DocsSidebar({ items, activeId }: DocsSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6 space-y-4">
        <div className="text-sm font-semibold text-foreground mb-3">
          On This Page
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const level = item.level || 2;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`
                  block text-sm py-1.5 transition-colors
                  ${level === 2 ? "pl-0" : ""}
                  ${level === 3 ? "pl-4" : ""}
                  ${
                    isActive
                      ? "text-primary font-medium border-l-2 border-primary pl-3"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

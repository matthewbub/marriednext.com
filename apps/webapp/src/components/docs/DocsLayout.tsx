import { ReactNode } from "react";

interface DocsLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
}

export function DocsLayout({ children, sidebar }: DocsLayoutProps) {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          <main className="flex-1 min-w-0 max-w-4xl">{children}</main>
          {sidebar}
        </div>
      </div>
    </div>
  );
}

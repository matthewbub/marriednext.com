import { ReactNode } from "react";

interface DocsCodeBlockProps {
  children: ReactNode;
  label?: string;
}

export function DocsCodeBlock({ children, label }: DocsCodeBlockProps) {
  return (
    <div className="mt-4 p-3 rounded-lg bg-muted/50">
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      <code className="text-sm font-mono text-foreground block">
        {children}
      </code>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-2 py-1 rounded bg-muted text-foreground font-mono text-sm">
      {children}
    </code>
  );
}

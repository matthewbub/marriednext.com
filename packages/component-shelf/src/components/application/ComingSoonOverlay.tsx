import { Construction } from "lucide-react";

interface ComingSoonOverlayProps {
  title?: string;
  description?: string;
}

export function ComingSoonOverlay({
  title = "Coming Soon",
  description = "We're working hard to bring you this feature. Check back soon!",
}: ComingSoonOverlayProps) {
  return (
    <div className="flex items-center justify-center backdrop-blur-sm mt-28">
      <div className="mx-4 max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Construction className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-serif text-3xl font-semibold text-foreground mb-3">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">{description}</p>
      </div>
    </div>
  );
}

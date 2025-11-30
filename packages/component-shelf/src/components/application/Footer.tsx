import { Heart, Github, Twitter } from "lucide-react";

export function ApplicationFooter() {
  return (
    <footer className="py-12 px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              <span className="font-serif text-xl font-semibold text-foreground">
                Married Next
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The free, open-source wedding planning platform couples actually
              love.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://github.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Existing code for Product section */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/templates"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Templates
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="/seating"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Seating Planner
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Wedding Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Open Source
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Married Next. Made with love for couples everywhere.
          </p>
          <p className="text-sm text-muted-foreground">
            Free to start • Open source • Transparent pricing
          </p>
        </div>
      </div>
    </footer>
  );
}

# Documentation Components

A collection of reusable components for building beautiful, consistent documentation pages.

## Components

### DocsLayout

Main layout wrapper for documentation pages. Provides consistent padding, max-width, and background gradient.

```tsx
<DocsLayout>{/* Your documentation content */}</DocsLayout>
```

### DocsHeader

Page header with badge, title, and description.

```tsx
<DocsHeader
  badge={{ icon: Activity, text: "Category Name" }}
  title="Page Title"
  description="Page description that explains what this documentation covers"
/>
```

### DocsBreadcrumb

Breadcrumb navigation for multi-level documentation.

```tsx
<DocsBreadcrumb
  items={[
    { label: "Category", href: "/documentation/category" },
    { label: "Current Page" },
  ]}
/>
```

### DocsSection

Section wrapper with optional title and icon.

```tsx
<DocsSection title="Section Title" icon={IconName}>
  {/* Section content */}
</DocsSection>
```

### DocsCallout

Highlighted callout box for important information.

```tsx
<DocsCallout
  icon={Shield}
  title="Important Note"
  variant="info" // info | warning | success | neutral
>
  Your callout message here
</DocsCallout>
```

### DocsCodeBlock & InlineCode

Code formatting components.

```tsx
{
  /* Inline code */
}
<InlineCode>variable_name</InlineCode>;

{
  /* Code block */
}
<DocsCodeBlock label="Example:">const example = "code here";</DocsCodeBlock>;
```

## Complete Example

```tsx
import {
  DocsLayout,
  DocsHeader,
  DocsSection,
  DocsCallout,
  DocsBreadcrumb,
  InlineCode,
} from "@/components/docs";
import { BookOpen, Shield } from "lucide-react";

export default function MyDocPage() {
  return (
    <DocsLayout>
      <DocsBreadcrumb items={[{ label: "My Documentation" }]} />

      <DocsHeader
        badge={{ icon: BookOpen, text: "Guide" }}
        title="My Feature"
        description="Learn how to use this amazing feature"
      />

      <DocsSection title="Getting Started">
        <p className="text-muted-foreground leading-relaxed">
          Start using <InlineCode>myFeature</InlineCode> by following these
          steps...
        </p>
      </DocsSection>

      <DocsCallout icon={Shield} title="Security Note" variant="warning">
        Always keep your credentials secure!
      </DocsCallout>
    </DocsLayout>
  );
}
```

## Adding New Documentation Pages

1. Create a new folder in `src/app/(docs)/documentation/`
2. Add a `page.tsx` file
3. Import and use the documentation components
4. Add your new page to the `documentationSections` array in `/documentation/page.tsx`

## Styling

All components use Tailwind CSS and respect the application's theme (including dark mode). They automatically adapt to the color scheme defined in `globals.css`.

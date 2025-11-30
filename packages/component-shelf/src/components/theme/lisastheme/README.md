# Lisa's Theme

A timeless, classic wedding website template.

## Structure

```
lisastheme/
├── LisasTheme.tsx      # Parent component - wires all sections together
├── types.ts            # TypeScript interfaces for all components
├── HeroSection.tsx     # Full-screen hero with names and date
├── CountdownSection.tsx # Live countdown to the wedding
├── OurStorySection.tsx # Timeline of the couple's journey
├── EventDetailsSection.tsx # Ceremony, venue, and dress code
├── GallerySection.tsx  # Photo grid
├── RsvpSection.tsx     # RSVP form or custom component slot
├── FaqSection.tsx      # Expandable FAQ accordion
├── RegistrySection.tsx # Links to gift registries
├── FooterSection.tsx   # Closing section with couple info
└── StickyNav.tsx       # Fixed navigation bar
```

## Prop Convention

Components separate **required database data** from **optional customizations**:

### `data` - Database Fields

Values that come from your database. Required for the component to function.

```tsx
<HeroSection
  data={{
    nameA: "Lisa",
    nameB: "Matthew",
    eventDate: "2026-07-26",
    location: "Napa Valley",
  }}
/>
```

### `customization` - Optional Overrides

Labels and style tweaks. All have sensible defaults from `label-shelf`.

```tsx
<HeroSection
  data={{ nameA: "Lisa", nameB: "Matthew" }}
  customization={{
    subtitleLabel: "We're Getting Married!",
  }}
/>
```

## Type Interfaces

Each component with database data has three interfaces in `types.ts`:

| Interface        | Purpose                        | JSDoc Tag       |
| ---------------- | ------------------------------ | --------------- |
| `*Data`          | Database-required fields       | `@database`     |
| `*Customization` | Optional label/style overrides | `@customizable` |
| `*Props`         | Combined props interface       | -               |

Example:

```typescript
/** @database */
export interface HeroSectionData {
  nameA: string | null;
  nameB: string | null;
  eventDate?: string | null;
  location?: string | null;
}

/** @customizable */
export interface HeroSectionCustomization {
  subtitleLabel?: string;
}

export interface HeroSectionProps {
  data: HeroSectionData;
  customization?: HeroSectionCustomization;
}
```

## Components Without Database Data

Some sections don't require database data - they're purely presentational with customizable content:

- `StickyNav` - Navigation labels
- `RegistrySection` - Registry links

These use only `customization?` without a `data` prop.

## Default Labels

All label defaults come from `label-shelf/lisastheme`. To customize:

1. Override via the `customization` prop at runtime
2. Or modify the label-shelf source for global changes

## Adding a New Section

1. Create `*Data` interface in `types.ts` (if DB data needed)
2. Create `*Customization` interface with label fields
3. Create `*Props` combining both
4. Build component with `data` and `customization` destructuring
5. Add to `LisasTheme.tsx` with data passed from parent props

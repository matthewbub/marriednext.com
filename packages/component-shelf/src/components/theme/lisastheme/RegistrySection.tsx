"use client";

import { ExternalLink } from "lucide-react";
import labels from "label-shelf/lisastheme";
import type {
  RegistryEntry,
  RegistrySectionCustomization,
  RegistrySectionProps,
} from "./types";
import { EditableLabel } from "../../ui/editable-label";

const defaultRegistryEntries: RegistryEntry[] = [
  {
    name: labels["lisastheme.registry.amazon.name.label"],
    description: labels["lisastheme.registry.amazon.description.label"],
    url: labels["lisastheme.registry.amazon.url.label"],
  },
  {
    name: labels["lisastheme.registry.crateandbarrel.name.label"],
    description: labels["lisastheme.registry.crateandbarrel.description.label"],
    url: labels["lisastheme.registry.crateandbarrel.url.label"],
  },
  {
    name: labels["lisastheme.registry.williamssonoma.name.label"],
    description: labels["lisastheme.registry.williamssonoma.description.label"],
    url: labels["lisastheme.registry.williamssonoma.url.label"],
  },
  {
    name: labels["lisastheme.registry.honeymoon.name.label"],
    description: labels["lisastheme.registry.honeymoon.description.label"],
    url: labels["lisastheme.registry.honeymoon.url.label"],
  },
];

const defaultRegistryCustomization: RegistrySectionCustomization = {
  pretitleLabel: labels["lisastheme.registry.section.pretitle.label"],
  titleLabel: labels["lisastheme.registry.section.title.label"],
  descriptionLabel: labels["lisastheme.registry.section.description.label"],
  entryButtonLabel: labels["lisastheme.registry.entry.button.label"],
  noteLabel: labels["lisastheme.registry.note.label"],
  registries: defaultRegistryEntries,
};

export function RegistrySection({
  customization = defaultRegistryCustomization,
  editable = false,
  onCustomizationChange,
}: RegistrySectionProps) {
  const registries = customization?.registries ?? [];

  const handleChange = (key: keyof RegistrySectionCustomization, value: string) => {
    onCustomizationChange?.(key, value);
  };

  return (
    <section id="registry" className="py-32 px-6 bg-[#faf9f6]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          {customization?.pretitleLabel && (
            <EditableLabel
              as="p"
              value={customization?.pretitleLabel}
              editable={editable}
              onChange={(v) => handleChange("pretitleLabel", v)}
              className="text-base tracking-[0.3em] uppercase text-[#745656] mb-4"
            />
          )}
          {customization?.titleLabel && (
            <EditableLabel
              as="h2"
              value={customization?.titleLabel}
              editable={editable}
              onChange={(v) => handleChange("titleLabel", v)}
              className="font-serif text-5xl md:text-6xl text-[#2c2c2c] mb-6"
            />
          )}
          {customization?.descriptionLabel && (
            <EditableLabel
              as="p"
              value={customization?.descriptionLabel}
              editable={editable}
              onChange={(v) => handleChange("descriptionLabel", v)}
              className="text-xl text-[#2c2c2c]/70 max-w-2xl mx-auto leading-relaxed"
            />
          )}
        </div>

        <div className="border-t border-[#2c2c2c]/10">
          {registries.map((registry) => (
            <a
              key={registry?.name}
              href={registry?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-8 border-b border-[#2c2c2c]/10 transition-colors duration-300 hover:bg-[#745656]/5 -mx-6 px-6"
            >
              <div className="flex-1">
                <h3 className="font-serif text-2xl md:text-3xl text-[#2c2c2c] mb-1 group-hover:text-[#745656] transition-colors duration-300">
                  {registry?.name}
                </h3>
                <p className="text-lg text-[#2c2c2c]/60">
                  {registry?.description}
                </p>
              </div>
              <div className="ml-6 flex items-center gap-2 text-[#745656] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-base tracking-wide">
                  {customization?.entryButtonLabel}
                </span>
                <ExternalLink className="w-5 h-5" />
              </div>
            </a>
          ))}
        </div>

        {customization?.noteLabel && (
          <EditableLabel
            as="p"
            value={customization?.noteLabel}
            editable={editable}
            onChange={(v) => handleChange("noteLabel", v)}
            className="text-center text-lg text-[#2c2c2c]/50 mt-12 italic"
          />
        )}
      </div>
    </section>
  );
}

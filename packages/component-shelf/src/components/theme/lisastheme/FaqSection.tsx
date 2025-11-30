"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import labels from "label-shelf/lisastheme";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionCustomization {
  pretitleLabel?: string;
  titleLabel?: string;
  noteLabel?: string;
  noteLinkLabel?: string;
  noteLinkHref?: string;
  faqs?: FaqItem[];
}

const defaultFaqItems: FaqItem[] = [
  {
    question: labels["lisastheme.faq.question.0.label"],
    answer: labels["lisastheme.faq.answer.0.label"],
  },
  {
    question: labels["lisastheme.faq.question.1.label"],
    answer: labels["lisastheme.faq.answer.1.label"],
  },
  {
    question: labels["lisastheme.faq.question.2.label"],
    answer: labels["lisastheme.faq.answer.2.label"],
  },
  {
    question: labels["lisastheme.faq.question.3.label"],
    answer: labels["lisastheme.faq.answer.3.label"],
  },
  {
    question: labels["lisastheme.faq.question.4.label"],
    answer: labels["lisastheme.faq.answer.4.label"],
  },
  {
    question: labels["lisastheme.faq.question.5.label"],
    answer: labels["lisastheme.faq.answer.5.label"],
  },
  {
    question: labels["lisastheme.faq.question.6.label"],
    answer: labels["lisastheme.faq.answer.6.label"],
  },
  {
    question: labels["lisastheme.faq.question.7.label"],
    answer: labels["lisastheme.faq.answer.7.label"],
  },
];

const defaultFaqCustomization: FaqSectionCustomization = {
  pretitleLabel: labels["lisastheme.faq.section.pretitle.label"],
  titleLabel: labels["lisastheme.faq.section.title.label"],
  noteLabel: labels["lisastheme.faq.section.intro.label"],
  noteLinkLabel: labels["lisastheme.faq.note.link.label"],
  noteLinkHref: labels["lisastheme.faq.note.link.href"],
  faqs: defaultFaqItems,
};

interface FaqSectionProps {
  customization?: FaqSectionCustomization;
}

export function FaqSection({
  customization = defaultFaqCustomization,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqItems = customization.faqs ?? [];

  return (
    <section id="faq" className="py-32 px-6 bg-[#faf9f6]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-sm tracking-[0.3em] uppercase text-[#745656] mb-4">
            {customization.pretitleLabel}
          </p>
          <h2 className="font-serif text-5xl md:text-6xl text-[#2c2c2c] mb-6">
            {customization.titleLabel}
          </h2>
          <div className="w-24 h-px bg-[#745656]/30 mx-auto" />
        </div>

        <div className="divide-y divide-[#745656]/20">
          {faqItems.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between text-left group"
              >
                <span className="font-serif text-xl md:text-2xl text-[#2c2c2c] group-hover:text-[#745656] transition-colors duration-300 pr-8">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-[#745656] transition-transform duration-300 flex-shrink-0",
                    openIndex === index && "rotate-180"
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500 ease-out",
                  openIndex === index
                    ? "max-h-96 opacity-100 mt-4"
                    : "max-h-0 opacity-0"
                )}
              >
                <p className="text-lg text-[#2c2c2c]/70 leading-relaxed pl-0 md:pl-0">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-12 border-t border-[#745656]/20 text-center">
          <p className="text-lg text-[#2c2c2c]/70 mb-4">
            {customization.noteLabel}
          </p>
          <a
            href={customization.noteLinkHref}
            className="inline-flex items-center gap-2 text-[#745656] text-lg hover:underline underline-offset-4 transition-all"
          >
            {customization.noteLinkLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

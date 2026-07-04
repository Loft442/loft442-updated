"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is your venue capacity?",
    answer: "We can host any event carrying a maximum load of 125 people.",
  },
  {
    question: "Can I make payment in installments?",
    answer:
      "Yes. You may make payments in installments. Payments for any event must be made in full two weeks prior to any event.",
  },
  {
    question: "Can I get extra time to for set up?",
    answer:
      "Yes, we will work closely with you regarding how many hours it will take for set up and ensure you have early access.",
  },
  {
    question: "Do you have a social media page?",
    answer:
      "Yes! You can find us on Instagram at @LOFT.442.  Please, follow, like, comment and share. ",
  },
  {
    question: "Can I bring outside catering?",
    answer: "Yes. Outside catering is allowed at LOFT 442.",
  },
  {
    question: "Is alcohol allowed?",
    answer:
      "Yes. Alcohol is permitted on the premises. However, liquor may not be sold without the proper licenses and permits.",
  },
  {
    question: "Do you provide bartenders?",
    answer: "Yes. Bartending services are available upon request.",
  },
  {
    question: "Is parking available?",
    answer:
      "Yes. We have a small parking lot adjacent to the building. Free street parking is also available nearby.",
  },
  {
    question: "How many hours are included with the rental?",
    answer: "Each event rental includes 6 hours.",
  },
  {
    question: "Can I decorate the venue?",
    answer:
      "Yes. Decorators are allowed. All decorations must be approved and set up in accordance with venue guidelines.",
  },
  {
    question: "Do you allow DJs?",
    answer:
      "Yes. DJs are allowed. LOFT 442 has a state-of-the-art sound system on site, so all you need to bring is your DJ.",
  },
  {
    question: "What is required to reserve a date?",
    answer:
      "A minimum deposit of $1,000 is required to reserve and hold any event date.",
  },
  {
    question: "Are tables and chairs included?",
    answer: "Yes. Tables and chairs are included with the venue rental.",
  },
  {
    question: "Do you offer military or first responder discounts?",
    answer:
      "Yes. LOFT 442 proudly offers discounts for military members and first responders. Proof of service is required.",
  },
];

const VISIBLE_COUNT = 5;

type FaqItemProps = {
  faq: (typeof faqs)[number];
  index: number;
  isOpen: boolean;
  onToggle: (index: number) => void;
};

function FaqItem({ faq, index, isOpen, onToggle }: FaqItemProps) {
  const panelId = `faq-panel-${index}`;
  const triggerId = `faq-trigger-${index}`;

  return (
    <div className="spotlight group rounded-sm border border-white/10 bg-white/5 transition-colors hover:border-white/20 hover:bg-white/10">
      <button
        type="button"
        id={triggerId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        onClick={() => onToggle(index)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-[padding] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
      >
        <span className="text-sm font-semibold leading-snug tracking-[0.14em] text-white/85">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-white/60 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-180 text-white/85" : ""
          }`}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        aria-hidden={!isOpen}
        className={`grid overflow-hidden transition-[grid-template-rows] duration-600 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <div
            className={`px-4 text-sm leading-relaxed text-white/65 transition-[opacity,transform,padding-bottom] duration-400 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
              isOpen
                ? "translate-y-0 opacity-100 pb-4 delay-75"
                : "-translate-y-1.5 opacity-0 pb-0 delay-0"
            }`}
          >
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const primaryFaqs = faqs.slice(0, VISIBLE_COUNT);
  const hiddenFaqs = faqs.slice(VISIBLE_COUNT);
  const hasMore = hiddenFaqs.length > 0;

  const handleToggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleToggleShowAll = () => {
    setShowAll((prev) => {
      if (prev) {
        setOpenIndex((current) =>
          current !== null && current >= VISIBLE_COUNT ? null : current
        );
      }
      return !prev;
    });
  };

  return (
    <section className="faq section-glow section-divider border-t border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="spotlight mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">FAQ</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[0.12em] text-white sm:text-3xl md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Quick answers to help you plan your experience with confidence.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {primaryFaqs.map((faq, index) => (
            <FaqItem
              key={`${faq.question}-${index}`}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onToggle={handleToggle}
            />
          ))}

          {hasMore && (
            <div
              aria-hidden={!showAll}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
                showAll ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 flex flex-col gap-3">
                {hiddenFaqs.map((faq, offset) => {
                  const index = VISIBLE_COUNT + offset;
                  return (
                    <FaqItem
                      key={`${faq.question}-${index}`}
                      faq={faq}
                      index={index}
                      isOpen={openIndex === index}
                      onToggle={handleToggle}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleToggleShowAll}
              aria-expanded={showAll}
              className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/5 px-5 py-3 text-[0.65rem] uppercase tracking-[0.35em] text-white/80 transition-[border-color,background-color,color,box-shadow,transform,opacity] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-px hover:border-[#d4af37]/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            >
              <span
                className={`transition-opacity duration-300 motion-reduce:transition-none ${
                  showAll ? "opacity-100" : "opacity-90"
                }`}
              >
                {showAll ? "View less" : "View more"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${
                  showAll ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

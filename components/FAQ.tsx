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
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const triggerId = `faq-trigger-${index}`;

            return (
              <div
                key={`${faq.question}-${index}`}
                className="spotlight group rounded-sm border border-white/10 bg-white/5 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <button
                  type="button"
                  id={triggerId}
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                >
                  <span className="text-sm font-semibold tracking-[0.14em] text-white/85">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-white/60 transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-180 text-white/85" : ""
                    }`}
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  aria-hidden={!isOpen}
                  className={`grid overflow-hidden px-4 transition-[grid-template-rows,opacity,transform] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] translate-y-0 opacity-100"
                      : "grid-rows-[0fr] -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="min-h-0 pb-4 text-sm leading-relaxed text-white/65">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

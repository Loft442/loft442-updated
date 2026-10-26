import { ChevronDown } from "lucide-react";
import FaqShowMore from "@/components/FaqShowMore";
import styles from "@/components/FAQ.module.css";

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

// Server-rendered: each question is a native <details>; sharing `name` keeps only one
// open at a time. The open/close motion lives in FAQ.module.css. Only the
// "View more" toggle needs client JS (FaqShowMore).
function FaqItem({ faq }: { faq: (typeof faqs)[number] }) {
  return (
    <details
      name="faq"
      className={`${styles.item} spotlight group rounded-sm border border-white/10 bg-white/5 transition-colors hover:border-white/20 hover:bg-white/10`}
    >
      <summary className={`${styles.summary} flex w-full cursor-pointer items-center justify-between gap-4 px-4 py-4 text-left`}>
        <span className="text-sm font-semibold leading-snug tracking-[0.14em] text-white/85">
          {faq.question}
        </span>
        <ChevronDown
          className={`${styles.chevron} h-4 w-4 shrink-0 text-white/60 transition-transform duration-300 ease-out`}
        />
      </summary>
      <div className={styles.panel}>
        <div className="min-h-0">
          <div className={`${styles.answer} px-4 text-sm leading-relaxed text-white/65`}>
            {faq.answer}
          </div>
        </div>
      </div>
    </details>
  );
}

export default function FAQ() {
  const primaryFaqs = faqs.slice(0, VISIBLE_COUNT);
  const hiddenFaqs = faqs.slice(VISIBLE_COUNT);

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
        {hiddenFaqs.length > 0 ? (
          <FaqShowMore
            primary={primaryFaqs.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          >
            {hiddenFaqs.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          </FaqShowMore>
        ) : (
          <div className="flex flex-col gap-3">
            {primaryFaqs.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

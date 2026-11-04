import { ChevronDown } from "lucide-react";
import FaqShowMore from "@/components/FaqShowMore";
import styles from "@/components/FAQ.module.css";

const faqs = [
  {
    question: "How many guests can Loft 442 accommodate?",
    answer:
      "Loft 442 accommodates up to 125 guests. The Essential package is designed for intimate gatherings of up to 50, and the Grand package for events of up to 125.",
  },
  {
    question: "How many hours are included?",
    answer:
      "Every event includes six hours of private use of the loft, plus four hours of complimentary access beforehand for décor and set-up.",
  },
  {
    question: "Can I arrange additional set-up time?",
    answer:
      "Certainly. We will work with you and your vendors to plan the time your set-up requires and arrange early access accordingly.",
  },
  {
    question: "What is required to reserve a date?",
    answer:
      "A $1,000 retainer reserves your date. The balance is due two weeks before your event, and installments can be arranged.",
  },
  {
    question: "May we bring our own caterer?",
    answer:
      "Yes. You are welcome to work with the caterer of your choice, or with our preferred catering partner, The Door.",
  },
  {
    question: "Is alcohol permitted?",
    answer:
      "Yes, alcohol may be served on the premises. Liquor may not be sold without the appropriate licenses and permits. Professional bartenders are available on request.",
  },
  {
    question: "Are tables, chairs and linens included?",
    answer:
      "Yes. Clear Chiavari seating, tables and black or white table linens are included with both packages.",
  },
  {
    question: "May we bring our own decorator and DJ?",
    answer:
      "Of course. Decorators are welcome, with décor approved in line with our venue guidelines. The loft has a professional sound system installed, so your DJ need only bring their music.",
  },
  {
    question: "Is parking available?",
    answer:
      "Yes. There is a small parking lot adjacent to the building, with complimentary street parking nearby.",
  },
  {
    question: "Do you offer military or first responder discounts?",
    answer:
      "Yes. Loft 442 proudly offers discounts to military members and first responders. Proof of service is required.",
  },
  {
    question: "Where can I see more of the space?",
    answer:
      "Visit our gallery, follow @loft.442 on Instagram, or request a private tour to experience the loft in person.",
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
      className={`${styles.item} group border-b border-[var(--line)] transition-colors`}
    >
      <summary className={`${styles.summary} flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left`}>
        <span className="font-serif text-lg leading-snug text-[var(--ivory)] transition-colors group-hover:text-gold-light sm:text-xl">
          {faq.question}
        </span>
        <ChevronDown
          className={`${styles.chevron} h-4 w-4 shrink-0 text-gold transition-transform duration-300 ease-out`}
        />
      </summary>
      <div className={styles.panel}>
        <div className="min-h-0">
          <div className={`${styles.answer} max-w-3xl pb-6 text-[0.95rem] leading-relaxed text-white/65`}>
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
    <section className="faq section-pad border-t border-[var(--line)]">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_2fr] md:gap-20">
        <div className="flex flex-col gap-5">
          <p className="eyebrow">Questions</p>
          <h2 className="display-lg">Planning, considered</h2>
          <p className="lede">
            The details our hosts most often ask about. For anything else, our team is a call away.
          </p>
        </div>
        <div className="border-t border-[var(--line)]">
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
          <div className="flex flex-col">
            {primaryFaqs.map((faq) => (
              <FaqItem key={faq.question} faq={faq} />
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}

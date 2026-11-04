import Reveal from "@/components/Reveal";

const GOOGLE_RATING = 4.8;

type Review = {
  name: string;
  comment: string;
  rating: number;
  /** Whole sentences quoted verbatim from `comment`; never reword a guest's review. */
  excerpt: string[];
};

const reviews: Review[] = [
  {
    name: "Shakima Vega",
    comment:
      "I gave my mom a surprise 60th birthday party at this venue and let me just tell you, it was everything advertised and more! Alfred, Justine and Andre were wonderful! Professional, patient and very very helpful! The venue in itself is beautiful. It's spacious, clean, with a nice bar set up. Andre communicated with me from the time I booked the venue to the time I actually had the event. Justine made sure that the venue was ready and available for me to decorate, she and Andre answered any questions I had. Alfred made sure everything was in order as far as the lighting, the backdrop and photo slides/videos. He helped arrange the tables how we wanted them and made sure the setup was to my liking! Anyone thinking to book this spot, don't wait—BOOK!!! Thank you all again for your professionalism and patience.",
    rating: 5,
    excerpt: [
      "The venue in itself is beautiful.",
      "It's spacious, clean, with a nice bar set up.",
      "Thank you all again for your professionalism and patience."
    ],
  },
  {
    name: "Stephanie Ximines",
    comment:
      "I hosted my husband's birthday party at this venue earlier this month and everything was perfect! From the moment I reached out to view the venue, Andre and his team were so responsive and accommodating. The booking was very straightforward and on the day of the party they were all on site making sure things went smoothly. I would definitely recommend this venue for your next event. It is not only a beautiful space, but you get the benefit of working with some really good people. 5 stars!",
    rating: 5,
    excerpt: [
      "From the moment I reached out to view the venue, Andre and his team were so responsive and accommodating.",
      "It is not only a beautiful space, but you get the benefit of working with some really good people."
    ],
  },
  {
    name: "Lloyd Linton",
    comment:
      "My twin sister and I celebrated our birthday at Loft442 in September 2025. I fell in love with this venue the first time I saw it. It's elegant and classy. It was a pleasure working with Andre and his partner, Mr. Alfred. They were both patient and understanding. Great business people. The venue is newly renovated, everything is brand new, and it's a great place to host your party. I would definitely use this venue again.",
    rating: 5,
    excerpt: [
      "I fell in love with this venue the first time I saw it.",
      "It's elegant and classy.",
      "It was a pleasure working with Andre and his partner, Mr. Alfred."
    ],
  },
  {
    name: "Kelly Belle",
    comment:
      "If I could recommend this venue to the entire world, I truly would! From the moment we walked in, I knew we made the right choice. The space is absolutely beautiful, clean, modern, and perfectly maintained. The bathrooms alone deserve a shoutout—they're gorgeous and spotless! What really set this place apart, though, were the owners. They are genuinely some of the nicest, most accommodating people I've ever had the pleasure of working with. They went above and beyond to make sure everything went smoothly and that we had everything we needed. Their kindness and professionalism made planning and hosting our event completely stress-free. Our party turned out even better than I imagined, and I know a big part of that was because of this venue and the amazing people who run it. I can't recommend it enough. 10/10 would absolutely book again!",
    rating: 5,
    excerpt: [
      "From the moment we walked in, I knew we made the right choice.",
      "The space is absolutely beautiful, clean, modern, and perfectly maintained.",
      "Their kindness and professionalism made planning and hosting our event completely stress-free."
    ],
  },
];

// Guard: an excerpt may only drop whole sentences, never change a guest's words.
if (process.env.NODE_ENV !== "production") {
  for (const review of reviews) {
    for (const sentence of review.excerpt) {
      if (!review.comment.includes(sentence)) {
        throw new Error(`Testimonial excerpt for ${review.name} is not verbatim: "${sentence}"`);
      }
    }
  }
}

/** Joins excerpt sentences, marking any gap where original sentences were left out. */
function joinExcerpt(review: Review) {
  return review.excerpt.reduce((text, sentence, index) => {
    if (index === 0) return sentence;
    const previous = review.excerpt[index - 1];
    const adjacent = review.comment.includes(`${previous} ${sentence}`);
    return `${text}${adjacent ? " " : " … "}${sentence}`;
  }, "");
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-1 text-gold" role="img" aria-label={`${rating} star rating`}>
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-3 w-3" />
      ))}
      {partialFill > 0 && (
        <span className="relative inline-block h-3 w-3">
          <Star className="h-3 w-3 text-white/20" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: `${partialFill * 100}%` }}>
            <Star className="h-3 w-3" />
          </span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-3 w-3 text-white/20" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal mode="text" className="mb-16 flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">Kind Words</p>
          <h2 className="display-lg">From the hosts we have welcomed</h2>
          <div className="flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-white/55">
            <StarRow rating={GOOGLE_RATING} />
            <span>{GOOGLE_RATING} on Google Reviews</span>
          </div>
        </Reveal>

        <div className="grid gap-px bg-[var(--line)] md:grid-cols-2">
          {reviews.map((review, index) => (
            <Reveal
              key={`${review.name}-${index}`}
              mode="slide"
              delayMs={index * 100}
              className="flex h-full flex-col justify-between gap-8 bg-[var(--background)] p-8 sm:p-12"
            >
              <figure className="flex flex-col gap-8">
                <span className="text-gold-accent font-serif text-6xl leading-none opacity-80" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="-mt-8 font-serif text-xl font-light leading-relaxed text-[var(--ivory)] sm:text-[1.4rem]">
                  {joinExcerpt(review)}
                </blockquote>
                <figcaption className="flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
                  <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/70">{review.name}</span>
                  <StarRow rating={review.rating} />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

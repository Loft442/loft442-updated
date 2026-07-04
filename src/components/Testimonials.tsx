import Reveal from "@/components/Reveal";

const GOOGLE_RATING = 4.7;

type Review = {
  name: string;
  comment: string;
  rating: number;
};

const reviews: Review[] = [
  {
    name: "Shakima Vega",
    comment:
      "I gave my mom a surprise 60th birthday party at this venue and let me just tell you, it was everything advertised and more! Alfred, Justine and Andre were wonderful! Professional, patient and very very helpful! The venue in itself is beautiful. It's spacious, clean, with a nice bar set up. Andre communicated with me from the time I booked the venue to the time I actually had the event. Justine made sure that the venue was ready and available for me to decorate, she and Andre answered any questions I had. Alfred made sure everything was in order as far as the lighting, the backdrop and photo slides/videos. He helped arrange the tables how we wanted them and made sure the setup was to my liking! Anyone thinking to book this spot, don't wait—BOOK!!! Thank you all again for your professionalism and patience.",
    rating: 5,
  },
  {
    name: "Stephanie Ximines",
    comment:
      "I hosted my husband's birthday party at this venue earlier this month and everything was perfect! From the moment I reached out to view the venue, Andre and his team were so responsive and accommodating. The booking was very straightforward and on the day of the party they were all on site making sure things went smoothly. I would definitely recommend this venue for your next event. It is not only a beautiful space, but you get the benefit of working with some really good people. 5 stars!",
    rating: 5,
  },
  {
    name: "Lloyd Linton",
    comment:
      "My twin sister and I celebrated our birthday at Loft442 in September 2025. I fell in love with this venue the first time I saw it. It's elegant and classy. It was a pleasure working with Andre and his partner, Mr. Alfred. They were both patient and understanding. Great business people. The venue is newly renovated, everything is brand new, and it's a great place to host your party. I would definitely use this venue again.",
    rating: 5,
  },
  {
    name: "Kelly Belle",
    comment:
      "If I could recommend this venue to the entire world, I truly would! From the moment we walked in, I knew we made the right choice. The space is absolutely beautiful, clean, modern, and perfectly maintained. The bathrooms alone deserve a shoutout—they're gorgeous and spotless! What really set this place apart, though, were the owners. They are genuinely some of the nicest, most accommodating people I've ever had the pleasure of working with. They went above and beyond to make sure everything went smoothly and that we had everything we needed. Their kindness and professionalism made planning and hosting our event completely stress-free. Our party turned out even better than I imagined, and I know a big part of that was because of this venue and the amazing people who run it. I can't recommend it enough. 10/10 would absolutely book again!",
    rating: 5,
  },
];

function Star({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l2.955 5.985 6.61.96-4.782 4.66 1.128 6.57L12 17.77l-5.911 3.105 1.128-6.57-4.782-4.66 6.61-.96L12 2.5z" />
    </svg>
  );
}

function StarRow({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div
      className="flex items-center gap-1 text-[#d4af37] [filter:drop-shadow(0_0_4px_rgba(212,175,55,0.45))]"
      role="img"
      aria-label={`${rating} star rating`}
    >
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4" />
      ))}
      {partialFill > 0 && (
        <span className="relative inline-block h-4 w-4">
          <Star className="h-4 w-4 text-white/20" />
          <span
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${partialFill * 100}%` }}
          >
            <Star className="h-4 w-4" />
          </span>
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={`empty-${index}`} className="h-4 w-4 text-white/20" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section-glow section-divider border-t border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal mode="text" className="spotlight mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">
            Testimonials
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[0.12em] text-white sm:text-3xl md:text-4xl">
            What Our Guests Say
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRow rating={GOOGLE_RATING} />
            <span className="text-sm text-white/70">{GOOGLE_RATING} on Google</span>
            <span className="rounded-sm border border-white/15 bg-white/5 px-2 py-1 text-[0.55rem] uppercase tracking-[0.25em] text-white/70">
              Google Reviews
            </span>
          </div>
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review, index) => (
            <Reveal
              key={`${review.name}-${index}`}
              mode="slide"
              delayMs={index * 100}
              className="spotlight flex h-full flex-col gap-4 rounded-sm border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-sm font-semibold text-[#f5e6a8]">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-[0.08em] text-white/90">
                    {review.name}
                  </p>
                  <StarRow rating={review.rating} />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-white/70">
                &ldquo;{review.comment}&rdquo;
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

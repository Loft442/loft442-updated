import Image from "next/image";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";

const included = [
  "(2) 75 Inch Multi Media TVs",
  "DJ Equipment / Speakers",
  "Backdrop Banner Photo Section",
  "Stand Up Refrigerator",
  "Stand Up Food Warmer",
  "Ice Bin",
  "Bar Sink",
  "Prelit Shelving for Liquor",
  "Television Behind Bar",
  "14 Ft. Black Granite Bar",
  "6 Hour Rental",
  "Courtesy 4 Hour Access For Decor / Set Up",
];

const packages = [
  {
    name: "The Essential",
    price: "3,700",
    guests: "Up to 50 guests",
    summary: "An intimate setting for dinners, showers and close-knit celebrations.",
    imageSrc: "/images/essential.webp",
    imageAlt: "The Essential package: an intimate table setting at Loft 442",
    items: ["50 clear Chiavari chairs", "5 round or cocktail tables", "3 rectangular tables"],
  },
  {
    name: "The Grand",
    price: "4,200",
    guests: "Up to 125 guests",
    summary: "The full loft, arranged for weddings, receptions and landmark evenings.",
    imageSrc: "/images/grand.webp",
    imageAlt: "The Grand package: the full Loft 442 salon set for a reception",
    items: ["100 clear Chiavari chairs", "10 round or cocktail tables", "6 rectangular tables"],
  },
];

const enhancements = [
  "Uplighting",
  "Premium white love seat",
  "Professional server",
  "Professional bartender",
  "Banquet chafing service (nine dishes)",
  "Low-lying fog",
  "Digital photo booth",
];

function Price({ amount }: { amount: string }) {
  return (
    <span className="text-gold-accent font-serif text-5xl font-light">
      <span className="mr-1 align-top text-xl">$</span>
      {amount}
    </span>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="pricing-page border-t border-[var(--line)] pb-20 pt-16 sm:pb-28 sm:pt-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal mode="text" className="flex flex-col items-center gap-6 text-center">
            <p className="eyebrow">Loft 442</p>
            <h1 className="display-xl">Packages &amp; Experiences</h1>
            <span className="hairline" aria-hidden="true" />
            <p className="lede max-w-2xl">
              Two collections, each with exclusive use of the loft and our team in attendance. Begin
              with the setting that suits your guest list, then refine it with curated enhancements.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-px bg-[var(--line)] lg:grid-cols-2">
            {packages.map((pkg, index) => (
              <Reveal
                key={pkg.name}
                mode="slide"
                delayMs={index * 120}
                className="flex flex-col bg-[var(--background)] p-8 sm:p-12"
              >
                <div className="relative aspect-[118/75] overflow-hidden">
                  <Image
                    src={pkg.imageSrc}
                    alt={pkg.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-4 border border-white/15" aria-hidden="true" />
                </div>

                <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-8">
                  <div className="flex flex-col gap-3">
                    <p className="eyebrow">{pkg.guests}</p>
                    <h2 className="display-md">{pkg.name}</h2>
                  </div>
                  <Price amount={pkg.price} />
                </div>

                <p className="mt-8 text-[0.95rem] leading-relaxed text-white/70">{pkg.summary}</p>

                <ul className="mt-6 flex flex-col gap-3 text-[0.95rem] text-white/80">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-4">
                      <span className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal mode="text" delayMs={120} className="mt-px border border-[var(--line)] p-8 sm:p-12">
            <p className="eyebrow">Every Event Includes</p>
            <ul className="mt-8 grid gap-x-12 gap-y-4 text-[0.95rem] text-white/80 sm:grid-cols-2">
              {included.map((item) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-[var(--line)] pb-4">
                  <span className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="pricing-page border-t border-[var(--line)] section-pad">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal mode="text" className="flex flex-col gap-6">
            <p className="eyebrow">Curated Enhancements</p>
            <h2 className="display-lg">Refine the evening</h2>
            <p className="lede">
              Thoughtful additions, arranged by our team and available with either collection.
            </p>
          </Reveal>

          <Reveal mode="text" delayMs={120}>
            <ul className="border-t border-[var(--line)]">
              {enhancements.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-4 border-b border-[var(--line)] py-5 text-[0.95rem] text-white/80"
                >
                  <span className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-gold" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <p className="lede max-w-xl">
            The best way to experience Loft 442 is in person. We would be delighted to show you
            the space.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button href="/schedule" className="w-full sm:w-64">Request a Tour</Button>
            <Button href="/gallery" variant="ghost" className="w-full sm:w-64">
              View the Gallery
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

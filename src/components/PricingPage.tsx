import Image from "next/image";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";
import { dateRequestNote, venuePackages } from "@/lib/packages";

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

const enhancements = [
  "Uplighting",
  "Premium white love seat",
  "Professional server",
  "Professional bartender",
  "Banquet chafing service (nine dishes)",
  "Low-lying fog",
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
          <Reveal mode="text" className="wine-copy-glow flex flex-col items-center gap-6 text-center">
            <p className="eyebrow">Loft 442</p>
            <h1 className="display-xl">Packages &amp; Experiences</h1>
            <span className="hairline" aria-hidden="true" />
            <p className="lede max-w-2xl">
              Two collections, each with exclusive use of the loft and our team in attendance. Begin
              with the setting that suits your guest list, then refine it with curated enhancements.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-px bg-[var(--line)] lg:grid-cols-2">
            {venuePackages.map((pkg, index) => (
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
                    quality={72}
                    loading="lazy"
                    className="object-cover"
                  />
                  <div className="pointer-events-none absolute inset-4 border border-white/15" aria-hidden="true" />
                </div>

                <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-8">
                  <div className="flex flex-col gap-3">
                    <p className="eyebrow !text-white">{pkg.guests}</p>
                    <h2 className="display-md flex flex-wrap items-baseline gap-x-2">
                      <span className="text-gold-accent">{pkg.name.replace(/ Package$/, "")}</span>
                      <span className="text-[0.72em] font-normal tracking-normal text-[var(--ivory)]">
                        Package
                      </span>
                    </h2>
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

        <div className="mx-auto mt-16 max-w-6xl px-6">
          <Reveal
            mode="slide"
            delayMs={80}
            className="grid gap-8 border border-[var(--line)] p-6 sm:gap-10 sm:p-12 md:grid-cols-[0.9fr_1.2fr_0.9fr] md:items-center md:gap-12 lg:gap-16"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden sm:max-w-[240px] md:max-w-none">
              <Image
                src="/images/photo-booth/salsa-2-product.webp"
                alt="Salsa 2 digital photo booth by Photobooth Supply Co."
                fill
                sizes="(min-width: 768px) 18vw, 180px"
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-4 sm:gap-5">
              <p className="eyebrow">Venue Add-On</p>
              <h3 className="display-md">Salsa 2 Photo Booth</h3>
              <p className="text-gold-light md:hidden">
                <span className="font-serif text-4xl font-normal">$400</span>
              </p>
              <p className="text-[0.95rem] leading-relaxed text-white/70">
                Add the digital booth to either package — digital sharing, an attendant, and an event gallery
                included for your guests.
              </p>
              <Button href="/photobooth" variant="ghost" className="mt-1 w-full sm:mt-2 sm:w-56">
                Photo Booth Details
              </Button>
            </div>
            <div className="hidden flex-col gap-2 border-t border-[var(--line)] pt-8 md:flex md:border-l md:border-t-0 md:pl-10 md:pt-0 lg:pl-12">
              <p className="eyebrow">Starting at</p>
              <p className="text-gold-light">
                <span className="font-serif text-4xl font-normal sm:text-5xl">$400</span>
              </p>
              <p className="mt-2 text-[0.95rem] text-white/60">Available with Signature Package or Grand Package.</p>
            </div>
          </Reveal>
        </div>

        <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center gap-6 px-6 text-center">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button href="/schedule" className="w-full sm:w-64">Check Availability</Button>
            <Button href="/gallery" variant="ghost" className="w-full sm:w-64">
              View the Gallery
            </Button>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">{dateRequestNote}</p>
        </div>
      </section>
    </>
  );
}

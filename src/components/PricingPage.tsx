import Reveal from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  Circle,
  Square,
  Tv,
  Music2,
  Image as ImageIcon,
  Refrigerator,
  Snowflake,
  Droplets,
  Wine,
  Monitor,
  GlassWater,
  Clock,
  Lightbulb,
  UserCheck,
  CoffeeIcon,
  Shirt,
  Wind,
  type LucideIcon,
} from "lucide-react";

const itemIcons: Record<string, LucideIcon> = {
  "50 Clear Chiavari Chairs": Armchair,
  "100 Clear Chiavari Chairs": Armchair,
  "5 Round / Cocktail Tables": Circle,
  "10 Round / Cocktail Tables": Circle,
  "3 Rectangular Tables": Square,
  "6 Rectangle Tables": Square,
  "(2) 75 Inch Multi Media TVs": Tv,
  "DJ Equipment / Speakers": Music2,
  "Backdrop Banner Photo Section": ImageIcon,
  "Stand Up Refrigerator": Refrigerator,
  "Ice Bin": Snowflake,
  "Bar Sink": Droplets,
  "Prelit Shelving for Liquor": Wine,
  "Television Behind Bar": Monitor,
  "14 Ft. Black Granite Bar": GlassWater,
  "6 Hour Rental": Clock,
  "Uplighting": Lightbulb,
  "Server(s)": UserCheck,
  "Bartender(s)": GlassWater,
  "Tablecloths (Black / White)": Shirt,
  "9 Banquet Chafing Dishes": CoffeeIcon,
  "Nimbus Low Lying Fog Machine": Wind,
};

const sharedAmenities = [
  "(2) 75 Inch Multi Media TVs",
  "DJ Equipment / Speakers",
  "Backdrop Banner Photo Section",
  "Stand Up Refrigerator",
  "Ice Bin",
  "Bar Sink",
  "Prelit Shelving for Liquor",
  "Television Behind Bar",
  "14 Ft. Black Granite Bar",
  "6 Hour Rental",
];

const packages = [
  {
    name: "Essential Package",
    price: "$3,700",
    peopleMax: "50 People Max",
    imageSrc: "/images/essential.webp",
    imageAlt: "Essential package event setup",
    items: [
      "50 Clear Chiavari Chairs",
      "5 Round / Cocktail Tables",
      "3 Rectangular Tables",
    ],
  },
  {
    name: "Grand Package",
    price: "$4,200",
    peopleMax: "125 People Max",
    imageSrc: "/images/grand.webp",
    imageAlt: "Grand package event setup",
    items: [
      "100 Clear Chiavari Chairs",
      "10 Round / Cocktail Tables",
      "6 Rectangle Tables",
    ],
  },
];

const addOns = [
  { service: "Uplighting", price: "$150" },
  { service: "Server(s)", price: "$250" },
  { service: "Bartender(s)", price: "$250" },
  { service: "Tablecloths (Black / White)", price: "$10" },
  { service: "9 Banquet Chafing Dishes", price: "$250" },
  { service: "Nimbus Low Lying Fog Machine", price: "$350" },
];

export default function PricingPage() {
  return (
    <>
      <section className="pricing-page section-glow section-divider relative border-t border-white/10 pb-16 pt-6 sm:pb-20 sm:pt-8">
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/10 backdrop-blur-xl"
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="spotlight rounded-sm px-4 py-3">
            <Reveal mode="text" className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white">Loft 442</p>
              <h1 className="text-spotlight relative inline-block text-3xl font-semibold tracking-[0.32em] text-white sm:text-4xl md:text-5xl">
                <span className="pointer-events-none absolute -inset-x-12 -inset-y-8 z-0 blur-3xl" style={{ background: "radial-gradient(ellipse at center, rgba(200,200,210,0.85) 0%, transparent 65%)" }} aria-hidden="true" />
                <span className="relative z-10">PRICING</span>
              </h1>
              <p className="max-w-2xl text-sm text-white/70">
                Choose the package that fits your event, then customize with additional
                services to create your ideal experience.
              </p>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {packages.map((pkg, index) => (
              <Reveal
                key={pkg.name}
                mode="slide"
                delayMs={index * 120}
                className="text-spotlight rounded-sm border border-white/10 bg-white/8 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-8"
              >
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#d9be62] sm:text-sm">
                      {pkg.name}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white">
                      {pkg.peopleMax}
                    </p>
                  </div>
                  <p className="text-3xl font-semibold tracking-[0.06em] text-white sm:text-4xl">
                    {pkg.price}
                  </p>
                </div>

                <div className="relative mt-5 aspect-[118/75] overflow-hidden rounded-sm border border-white/10">
                  <Image
                    src={pkg.imageSrc}
                    alt={pkg.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <ul className="mt-6 space-y-3 text-sm text-white sm:text-base">
                  {pkg.items.map((item) => {
                    const Icon = itemIcons[item];
                    return (
                      <li key={item} className="flex items-center gap-3">
                        {Icon ? (
                          <Icon className="h-4 w-4 shrink-0 text-[#d4af37]" />
                        ) : (
                          <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                        )}
                        <span>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            ))}
          </div>

          <Reveal
            mode="text"
            delayMs={120}
            className="about-card-outline group relative mt-6 rounded-sm p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition sm:p-5"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#d9be62] sm:text-sm">
              Both Packages Include
            </p>
            <ul className="mt-3 grid gap-3 text-sm text-white sm:grid-cols-2 sm:text-base">
              {sharedAmenities.map((amenity) => {
                const Icon = itemIcons[amenity];
                return (
                  <li key={amenity} className="flex items-center gap-3">
                    {Icon ? (
                      <Icon className="h-4 w-4 shrink-0 text-[#d4af37]" />
                    ) : (
                      <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-[#d4af37]" />
                    )}
                    <span>{amenity}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="pricing-page section-divider border-t border-white/10 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal mode="text" className="rounded-sm border border-white/10 bg-white/6 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
                Additional Services
              </h2>
              <p className="text-[0.62rem] uppercase tracking-[0.32em] text-white">
                Available as add-ons
              </p>
            </div>

            <div className="mt-6 divide-y divide-white/10 rounded-sm border border-white/10 bg-black/40">
              {addOns.map((item) => {
                const Icon = itemIcons[item.service];
                return (
                  <div
                    key={item.service}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm text-white sm:px-5 sm:text-base"
                  >
                    <span className="flex items-center gap-3">
                      {Icon && <Icon className="h-4 w-4 shrink-0 text-[#d4af37]" />}
                      {item.service}
                    </span>
                    <span className="font-medium tracking-[0.04em] text-white">{item.price}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/schedule"
                className="inline-flex h-11 items-center justify-center rounded-sm border border-[#d4af37] px-5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)]"
              >
                Start planning
              </Link>
              <Link
                href="/gallery"
                className="inline-flex h-11 items-center justify-center rounded-sm border border-white/20 px-5 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-white/50 hover:bg-white/10 hover:text-white"
              >
                View Gallery
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

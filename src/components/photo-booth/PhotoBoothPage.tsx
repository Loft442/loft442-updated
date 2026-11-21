import Image from "next/image";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import Button from "@/components/ui/Button";
import FilmPlayer from "@/components/photo-booth/FilmPlayer";
import PhotoBoothInquiry from "@/components/photo-booth/PhotoBoothInquiry";
import PhotoGrid, { type BoothPhoto } from "@/components/photo-booth/PhotoGrid";
import { TEAM_EMAIL } from "@/lib/contacts";
import styles from "@/components/FAQ.module.css";

const IMG = "/images/photo-booth";

const eventPhotos: BoothPhoto[] = [
  { src: `${IMG}/wedding.webp`, width: 967, height: 1450, title: "Weddings", caption: "Weddings", alt: "Bride and groom posing beside the Salsa 2 at a floral wedding setup", objectPosition: "center 43%" },
  { src: `${IMG}/event-corporate.webp`, width: 1600, height: 1067, title: "Corporate events", caption: "Corporate events", alt: "Three black-tie guests at a candlelit gala dinner", objectPosition: "61% center" },
  { src: `${IMG}/event-private.webp`, width: 1600, height: 1066, title: "Private parties", caption: "Private parties", alt: "Guests in formalwear raising their glasses at a private celebration", objectPosition: "72% center" },
  { src: `${IMG}/glam.webp`, width: 675, height: 900, title: "Black-and-white portraits", caption: "Black-and-white booth portraits", alt: "Black-and-white photo booth portrait of a woman posing against a simple backdrop", objectPosition: "center 43%" },
];

const setupPhotos: BoothPhoto[] = [
  { src: `${IMG}/salsa-studio.webp`, width: 1200, height: 800, title: "The full setup", caption: "The Salsa 2 on its stand", alt: "A full-length white Salsa 2 on its pedestal in a violet studio" },
  { src: `${IMG}/dance.webp`, width: 633, height: 950, title: "Room for a group", caption: "Guests gather for a photo", alt: "Dressed-up guests posing beside a standing white Salsa 2 booth in a flower-lined courtyard" },
  { src: `${IMG}/salsa-guests.webp`, width: 1200, height: 1500, title: "Touchscreen and ring light", caption: "The Salsa 2 touchscreen and ring light", alt: "Guests in eveningwear using a Salsa 2 touchscreen framed by a bright ring light" },
];

const templatePhotos: BoothPhoto[] = [
  { src: `${IMG}/template-champagne.webp`, width: 1000, height: 1250, title: "Champagne Monogram", subtitle: "Digital overlay", caption: "Champagne Monogram · Digital overlay", mat: "#d7c7a5", alt: "A wedding portrait with a thin gold frame and a champagne band featuring the couple’s monogram, names, and wedding date" },
  { src: `${IMG}/template-black-tie.webp`, width: 1000, height: 1250, title: "Black Tie", subtitle: "Digital overlay", caption: "Black Tie · Digital overlay", mat: "#a7a7a4", alt: "A black-and-white wedding portrait with a fine white border and the couple’s names and date overlaid along the bottom" },
  { src: `${IMG}/template-ivory-strip.webp`, width: 480, height: 1440, title: "Ivory Classic", subtitle: "2 × 6 photo strip", caption: "Ivory Classic · 2 × 6 photo strip", mat: "#ded8cb", alt: "A three-frame ivory photo strip with the couple’s names and wedding date in gold and dark brown below the photos" },
  { src: `${IMG}/template-burgundy.webp`, width: 960, height: 1440, title: "Burgundy Keepsake", subtitle: "4 × 6 photo layout", caption: "Burgundy Keepsake · 4 × 6 photo layout", mat: "#c0b6a7", alt: "A burgundy and gold keepsake with three photo frames and a custom wedding name and date panel" },
];

const features = [
  { title: "Flattering light", body: "Built-in lighting for everything from a couple’s portrait to a group shot." },
  { title: "Still photos and motion", body: "Ask about classic photos, GIFs, boomerangs, and short video captures." },
  { title: "Personalized photo designs", body: "Ask about adding your names, event date, or company logo to your photo design." },
];

const packages = [
  { name: "Essential", price: "699", hours: "4 hours", featured: true, items: ["Digital photos", "One digital backdrop", "One standard photo layout"] },
  { name: "Signature", price: "899", hours: "6 hours", items: ["Digital photos, GIFs, and boomerangs", "Up to two digital backdrops", "One standard photo layout"] },
  { name: "Premier", price: "1,099", hours: "8 hours", items: ["Digital photos, GIFs, and boomerangs", "Up to three digital backdrops", "One standard photo layout", "Black-and-white portrait option"] },
];

const faqs = [
  { q: "Can I book the booth at another venue?", a: "Yes. Choose a 4-, 6-, or 8-hour off-site package and share your venue address when you inquire. Setup, breakdown, and an attendant are included. We’ll confirm any travel or parking charges in your quote." },
  { q: "How do digital backdrops work?", a: "Digital backdrops appear in the finished photos. Choose from our existing collection. Essential includes one, Signature includes up to two, and Premier includes up to three." },
  { q: "Can you personalize the photo layout?", a: "Yes. Each off-site package includes a standard layout. Custom designs with names, event colors, or a company logo start at $75. You can see examples in the photo template gallery above." },
  { q: "How do guests get their photos?", a: "Guests can share their photos digitally. You’ll also receive an event gallery after the celebration." },
  { q: "How do I check my date?", a: "Choose a package or use the form below. Share your date and venue, and we’ll confirm availability and send your quote." },
];

const creditLinkClass = "underline underline-offset-[0.2em] hover:text-gold-light";

function SectionHead({ eyebrow, title, body, id }: { eyebrow: string; title: ReactNode; body: string; id: string }) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-5">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="display-lg">{title}</h2>
      </div>
      <p className="lede max-w-md">{body}</p>
    </div>
  );
}

function Price({ amount }: { amount: string }) {
  return (
    <span className="text-gold-accent font-serif text-5xl font-light">
      <span className="mr-1 align-top text-xl">$</span>
      {amount}
    </span>
  );
}

export default function PhotoBoothPage() {
  return (
    <>
      <section aria-labelledby="booth-hero-title" className="border-t border-[var(--line)] md:grid md:min-h-[clamp(575px,49vw,760px)] md:grid-cols-[49%_51%]">
        <div className="relative z-10 flex min-w-0 items-center px-6 py-16 sm:py-24 md:px-[clamp(1.5rem,4vw,5rem)]">
          <Reveal mode="text" className="flex w-full max-w-xl flex-col gap-6">
            <p className="eyebrow">Salsa 2 · Photo Booth Rentals</p>
            <h1 id="booth-hero-title" className="display-xl">
              Picture <em className="display-italic">the night.</em>
            </h1>
            <span className="hairline" aria-hidden="true" />
            <p className="lede">
              An elegant photo booth for weddings, corporate events, and private parties. Give your guests a
              reason to step in front of the camera and a photo to take home.
            </p>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <Button href="#inquire" className="w-full sm:w-auto">Check Your Date</Button>
              <Button href="#packages" variant="ghost" className="w-full sm:w-auto">View Packages</Button>
            </div>
          </Reveal>
        </div>
        <figure className="relative z-0 min-w-0 overflow-hidden h-[clamp(285px,84vw,490px)] md:h-auto">
          <Image
            src={`${IMG}/event-hero-group.webp`}
            alt="Guests in cocktail attire laughing and posing with the handheld Salsa 2 photo booth"
            fill
            priority
            quality={72}
            sizes="(min-width: 768px) 51vw, 100vw"
            className="object-cover object-[34%_center] md:object-[37%_center]"
          />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent to-25%" />
          <figcaption className="absolute bottom-4 right-4 z-10 text-[0.7rem] font-normal tracking-[0.15em] text-white md:bottom-7 md:right-7">
            SALSA 2 <span className="px-1 text-gold">·</span> IN ACTION
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="booth-experience-title" className="border-t border-[var(--line)] section-pad">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1.08fr_1fr] md:gap-20">
          <Reveal mode="slide" className="relative z-0 order-2 min-w-0 overflow-hidden h-[clamp(255px,74vw,425px)] bg-[#d8d5cd] md:order-1 md:h-[clamp(330px,36vw,540px)]">
            <Image
              src={`${IMG}/salsa-detail.webp`}
              alt="Close-up of the white oval housing and slim pedestal of the Salsa 2"
              fill
              quality={70}
              sizes="(min-width: 768px) 50vw, 100vw"
              loading="lazy"
              className="object-cover object-[50%_46%]"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-[#f4efe6aa]" />
          </Reveal>
          <Reveal mode="text" className="relative z-10 order-1 flex min-w-0 flex-col gap-6 md:order-2">
            <p className="eyebrow">The Experience</p>
            <h2 id="booth-experience-title" className="display-lg">
              Meet <em className="display-italic">Salsa 2.</em>
            </h2>
            <p className="lede">
              A slim white booth with a built-in ring light that fits into a reception, a company gala, or a
              private celebration.
            </p>
            <ul className="mt-2 flex flex-col border-t border-[var(--line)]">
              {features.map((feature) => (
                <li key={feature.title} className="flex gap-4 border-b border-[var(--line)] py-5">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-xl text-[var(--ivory)]">{feature.title}</h3>
                    <p className="text-[0.95rem] leading-relaxed text-white/65">{feature.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="booth-gallery-title" className="border-t border-[var(--line)] section-pad">
        <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6">
          <div>
            <SectionHead
              id="booth-gallery-title"
              eyebrow="The Gallery"
              title={<>When the flash <em className="display-italic">goes off.</em></>}
              body="From wedding receptions and company galas to milestone birthdays and private dinners."
            />
            <PhotoGrid photos={eventPhotos} variant="gallery" />
            <p className="mt-6 text-xs text-white/40">
              Event inspiration and sample booth photography by Photobooth Supply Co.,{" "}
              <a href="https://unsplash.com/photos/UCHR7VqS8lk" className={creditLinkClass}>Filip Rankovic Grobgaard</a>, and{" "}
              <a href="https://www.pexels.com/photo/people-toasting-and-smiling-15591483/" className={creditLinkClass}>Juliano Astc</a>.
            </p>
          </div>

          <div>
            <SectionHead
              id="booth-setup-title"
              eyebrow="The Booth in Action"
              title={<>A closer <em className="display-italic">look.</em></>}
              body="See the booth up close and how it looks with guests in the frame."
            />
            <PhotoGrid photos={setupPhotos} variant="setup" />
            <p className="mt-6 text-xs text-white/40">Salsa 2 demonstration photography by Photobooth Supply Co.</p>
          </div>

          <div id="wedding-templates" className="scroll-mt-28">
            <SectionHead
              id="booth-template-title"
              eyebrow="Wedding Photo Templates"
              title={<>Make it <em className="display-italic">yours.</em></>}
              body="See how your names, wedding date, and colors can look on a finished photo. Select any design for a closer look."
            />
            <PhotoGrid photos={templatePhotos} variant="template" />
            <p className="mt-6 text-xs text-white/40">
              Illustrative designs with sample photos and fictional wedding details. Wedding portraits by{" "}
              <a href="https://unsplash.com/photos/VA8VxEFnUGM" className={creditLinkClass}>HACA Wedding Film</a>,{" "}
              <a href="https://unsplash.com/photos/cWLEzYAcI3Q" className={creditLinkClass}>Rafa Sanfilippo</a>, and{" "}
              <a href="https://unsplash.com/photos/yYvFu_SpkB0" className={creditLinkClass}>Emanuel Flores</a>.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="booth-film-title" className="border-t border-[var(--line)] section-pad">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal mode="text" className="relative z-10 flex min-w-0 flex-col gap-6">
            <p className="eyebrow">The Film</p>
            <h2 id="booth-film-title" className="display-lg">
              Salsa 2 <em className="display-italic">in motion.</em>
            </h2>
            <p className="lede">See the booth up close in the official Salsa 2 product film.</p>
          </Reveal>
          <Reveal mode="slide" className="relative z-0 min-w-0 overflow-hidden">
            <FilmPlayer />
            <p className="mt-4 text-xs text-white/40">
              Film by Photobooth Supply Co.{" "}
              <a href="https://www.youtube.com/watch?v=A3-s9vRjNU4" target="_blank" rel="noopener noreferrer" className={creditLinkClass}>
                See the official introduction on YouTube
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <section id="packages" aria-labelledby="booth-packages-title" className="scroll-mt-28 border-t border-[var(--line)] section-pad">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHead
            id="booth-packages-title"
            eyebrow="Salsa 2 Rentals"
            title={<>Photo booth <em className="display-italic">packages.</em></>}
            body="Three off-site packages for celebrations at your venue."
          />
          <div className="grid gap-px bg-[var(--line)] lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <Reveal
                key={pkg.name}
                mode="slide"
                delayMs={index * 100}
                className={`relative flex flex-col bg-[var(--background)] p-8 sm:p-10 ${pkg.featured ? "outline outline-1 -outline-offset-1 outline-gold/70" : ""}`}
              >
                {pkg.featured ? <p className="eyebrow mb-4">Recommended</p> : null}
                <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-white/55">{pkg.hours}</p>
                    <h3 className="display-md">{pkg.name}</h3>
                  </div>
                  <Price amount={pkg.price} />
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-[0.95rem] text-white/80">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-4">
                      <span className="h-px w-4 shrink-0 translate-y-[-0.3em] bg-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  href="#inquire"
                  variant={pkg.featured ? "primary" : "ghost"}
                  className="mt-8 w-full"
                  data-package={pkg.name}
                >
                  Choose {pkg.name}
                </Button>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-[0.95rem] leading-relaxed text-white/60">
            Every off-site package includes an attendant, digital sharing, an event gallery, setup, and
            breakdown. Choose your digital backdrops and standard layout from our existing collection. Any
            travel or parking charges are confirmed in your quote.
          </p>

          <div className="mt-12 grid gap-px bg-[var(--line)] md:grid-cols-2">
            <div className="flex flex-col gap-3 bg-[var(--background)] p-8 sm:p-10">
              <h3 className="display-md">Hosting at LOFT 442?</h3>
              <p className="text-gold-light"><span className="font-serif text-2xl font-normal">$400</span> · 2 hours</p>
              <p className="text-[0.95rem] text-white/65">Add the Salsa 2 booth to your LOFT 442 venue booking.</p>
              <a
                href="#inquire"
                data-package="LOFT 442 Venue Add-On"
                className="tap mt-2 self-start text-[0.7rem] uppercase tracking-[0.3em] text-gold-light underline underline-offset-4 hover:text-gold"
              >
                Inquire about the venue add-on
              </a>
            </div>
            <div className="flex flex-col gap-3 bg-[var(--background)] p-8 sm:p-10">
              <h3 className="display-md">Custom photo layouts</h3>
              <p className="text-gold-light"><span className="font-serif text-2xl font-normal">From $75</span> · $50 each additional layout</p>
              <p className="text-[0.95rem] text-white/65">
                Add names, a date, a monogram, event colors, or a company logo. Includes one design proof and
                one revision. Available with any package.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="booth-faq-title" className="border-t border-[var(--line)] section-pad">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <Reveal mode="text" className="flex flex-col gap-5">
            <p className="eyebrow">Before You Book</p>
            <h2 id="booth-faq-title" className="display-lg">
              Good to <em className="display-italic">know.</em>
            </h2>
          </Reveal>
          <div className="border-t border-[var(--line)]">
            {faqs.map((faq) => (
              <details key={faq.q} name="booth-faq" className={`${styles.item} group border-b border-[var(--line)]`}>
                <summary className={`${styles.summary} flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-serif text-lg text-[var(--ivory)] sm:text-xl`}>
                  {faq.q}
                  <ChevronDown className={`${styles.chevron} h-4 w-4 shrink-0 text-gold transition-transform duration-300 ease-out`} strokeWidth={1.5} />
                </summary>
                <div className={styles.panel}>
                  <div className="min-h-0">
                    <p className={`${styles.answer} max-w-3xl text-[0.95rem] leading-relaxed text-white/65`}>{faq.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="inquire" aria-labelledby="booth-inquiry-title" className="scroll-mt-28 border-t border-[var(--line)] section-pad">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[1fr_1.4fr] md:gap-20">
          <Reveal mode="text" className="flex flex-col gap-6">
            <p className="eyebrow">Event Inquiries</p>
            <h2 id="booth-inquiry-title" className="display-lg">
              What’s <em className="display-italic">your date?</em>
            </h2>
            <p className="lede">
              Share your event date and venue. We’ll follow up about availability, pricing, and photo booth
              options for your event.
            </p>
            <div className="flex flex-col gap-2 text-[0.95rem]">
              <a href={`mailto:${TEAM_EMAIL}?subject=Salsa%202%20Photo%20Booth`} className="tap self-start text-gold-light hover:text-gold">
                {TEAM_EMAIL}
              </a>
              <a href="tel:+13475796578" className="tap self-start text-white/75 hover:text-gold-light">
                (347) 579-6578
              </a>
            </div>
          </Reveal>
          <PhotoBoothInquiry />
        </div>
      </section>
    </>
  );
}

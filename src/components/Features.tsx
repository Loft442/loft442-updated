import Image from "next/image";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

type FeatureBlockProps = {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  image: { src: string; alt: string };
  imageFirst?: boolean;
  titleClassName?: string;
};

function FeatureBlock({ id, eyebrow, title, children, image, imageFirst = false, titleClassName = "display-md" }: FeatureBlockProps) {
  return (
    <section id={id} className="scroll-mt-28 md:scroll-mt-32 section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className={`flex flex-col gap-7 ${imageFirst ? "md:order-2" : ""}`}>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className={titleClassName}>{title}</h2>
            <span className="hairline" aria-hidden="true" />
            <div className="flex flex-col gap-5">{children}</div>
          </div>
          <div
            className={`relative w-full aspect-[4/5] overflow-hidden sm:aspect-[543/420] ${imageFirst ? "md:order-1" : ""}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="reveal reveal-image object-cover"
            />
            <div className="pointer-events-none absolute inset-4 border border-white/15" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <FeatureBlock
      id="about"
      eyebrow="About Loft 442"
      title={
        <>
          A private loft, <em className="display-italic">thoughtfully</em> appointed
        </>
      }
      image={{ src: "/images/ribbon3.webp", alt: "The Loft 442 salon dressed for a reception" }}
    >
      <p className="lede">
        Loft 442 is an intimate, veteran-owned event venue in Elmont, on the border of Queens and
        Long Island. Designed for weddings, milestone celebrations and private gatherings, the loft
        pairs modern elegance with warm, urban character: tailored seating, a flexible floor plan
        and integrated sound, lighting and video.
      </p>
      <p className="lede">
        Guided by discipline, integrity and a genuine attention to detail, our team hosts a limited
        number of events so that each one receives our complete focus.
      </p>
    </FeatureBlock>
  );
}

export function TributeSection() {
  return (
    <FeatureBlock
      id="tribute"
      eyebrow="A Tribute to Service & Sacrifice"
      title="Built on the values of service"
      image={{ src: "/images/military-ex.webp", alt: "A tribute to military service at Loft 442" }}
      imageFirst
    >
      <p className="lede">
        Loft 442 is proudly veteran-owned. We honor the men and women who have served, not only in
        words, but through respect, integrity and community. The discipline, dedication and pride
        carried from service shape every event we host.
      </p>
      <p className="lede">
        As a tribute to service, Loft 442 extends exclusive discounts to all active and retired
        veterans and first responders.
      </p>
    </FeatureBlock>
  );
}

export function StandardSection() {
  return (
    <FeatureBlock
      eyebrow="Our Standard"
      title={
        <>
          Attentive, discreet and <em className="display-italic">detail-led</em>
        </>
      }
      image={{ src: "/images/quality-promise2.webp", alt: "Table and décor detail at Loft 442" }}
    >
      <p className="lede">
        Every event at Loft 442 is prepared with precision. The space is immaculately kept, the
        technology is ready before your guests arrive, and a member of our team is on hand from
        set-up to the final farewell.
      </p>
      <p className="lede">
        We welcome your planner, decorator, DJ and caterer, and coordinate with them so the evening
        feels effortless for you and for every guest.
      </p>
    </FeatureBlock>
  );
}

export default function Features() {
  return (
    <>
      <AboutSection />
      <TributeSection />
      <StandardSection />
    </>
  );
}

import Link from "next/link";
import ContactUsLink from "@/components/ContactUsLink";
import FlyerViewer from "@/components/FlyerViewer";
import Reveal from "@/components/Reveal";
import { Heart, MapPin, Sparkles, Users } from "lucide-react";

const sections = [
  {
    icon: Sparkles,
    title: "What Our Venue Offers",
    body: "Our event space includes tables, chairs, a bar area, refrigerator, ice bin, TVs, sound equipment, and flexible layout options. Families are welcome to bring in outside catering, allowing you to choose food and service that best honors your loved one and supports your guests.",
  },
  {
    icon: MapPin,
    title: "Conveniently Located",
    body: "LOFT 442 is located in Elmont, NY, making it convenient for families coming from Nassau County, Queens, Brooklyn, Long Island, and nearby funeral homes. Our location provides an elegant and accessible option for families looking for a private repass venue close to home.",
  },
  {
    icon: Heart,
    title: "Compassionate Service Every Step of the Way",
    body: "We know that every family's needs are different. Our team is here to help answer questions, review availability, and assist you with planning a respectful gathering. From the first call to the day of your event, we are committed to providing professional and compassionate service.",
  },
];

export default function RepassPage() {
  return (
    <>
      <section className="relative pb-0 pt-6 sm:pt-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="spotlight rounded-sm px-4 py-3">
            <Reveal mode="text" className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white">
                Loft 442
              </p>
              <h1 className="text-spotlight relative inline-block text-3xl font-semibold tracking-[0.16em] text-white sm:text-4xl sm:tracking-[0.32em] md:text-5xl">
                <span
                  className="pointer-events-none absolute -inset-x-12 -inset-y-8 z-0 blur-3xl"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(200,200,210,0.85) 0%, transparent 65%)",
                  }}
                  aria-hidden="true"
                />
                <span className="relative z-10">REPASS SERVICES</span>
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-white/70">
                During a difficult time, LOFT 442 provides a warm, private, and
                elegant space for families to gather, reflect, and honor the life
                of their loved one. Our venue is designed to offer comfort,
                privacy, and a welcoming atmosphere for family and friends
                following funeral or memorial services.
              </p>
            </Reveal>
          </div>

          <Reveal
            mode="text"
            delayMs={80}
            className="about-card-outline mt-6 rounded-sm p-5 sm:mt-8 sm:p-6"
          >
            <div className="flex items-start gap-3">
              <Users className="mt-1 h-5 w-5 shrink-0 text-[#d4af37]" />
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                Located in Elmont, NY, LOFT 442 proudly serves families
                throughout Nassau County, Queens, Long Island, and surrounding
                communities. Whether you are planning an intimate repass or a
                larger gathering, our space can be arranged to fit your
                family&apos;s needs with dignity and care.
              </p>
            </div>
          </Reveal>

          <Reveal mode="text" delayMs={120} className="mt-6 max-w-3xl">
            <p className="text-sm leading-relaxed text-white/70 sm:text-base">
              At LOFT 442, we understand that planning a repass can be emotional
              and time-sensitive. Our goal is to make the process as simple and
              stress-free as possible so families can focus on being together.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-stretch lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <Reveal
              mode="text"
              delayMs={140}
              className="w-full rounded-sm border border-white/10 bg-white/6 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:p-6 md:flex md:h-full md:min-h-0 md:flex-col"
            >
              <h2 className="shrink-0 text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
                Repass Flyer
              </h2>
              <FlyerViewer
                src="/images/Flyer/loft442-repass-flyer.webp"
                alt="LOFT 442 repass services flyer"
                pdfHref="/images/Flyer/Loft442 Repass Flyer.pdf"
                aspectClassName="aspect-[736/951]"
                thumbnailClassName="mx-0 max-w-full"
                fillHeight
                centerDownload
              />
            </Reveal>

            <div className="flex min-w-0 flex-col gap-6 md:h-full">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.title}
                    className="w-full text-spotlight rounded-sm border border-white/10 bg-white/8 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6"
                  >
                    <Icon className="h-5 w-5 text-[#d4af37]" />
                    <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white sm:text-base">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {section.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Reveal
            mode="text"
            delayMs={180}
            className="mt-8 mb-10 rounded-sm border border-white/10 bg-white/6 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:mt-10 sm:p-6"
          >
            <h2 className="text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
              Schedule a Tour or Check Availability
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
              If you are looking for a repass venue in Elmont, NY, LOFT 442 is
              here to help. Contact us today to check availability, schedule a
              tour, or discuss how we can support your family during this time.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/schedule"
                className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-[#d4af37] px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] sm:w-auto"
              >
                Check availability
              </Link>
              <ContactUsLink className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-white/20 px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white transition hover:border-white/50 hover:bg-white/10 sm:w-auto" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

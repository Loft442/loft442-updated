import Link from "next/link";
import ContactUsLink from "@/components/ContactUsLink";
import FlyerViewer from "@/components/FlyerViewer";
import Reveal from "@/components/Reveal";
import { ChefHat, Truck, UtensilsCrossed } from "lucide-react";

const highlights = [
  {
    icon: ChefHat,
    title: "Exclusive Catering Partner",
    body: "LOFT 442 offers access to exclusive discounted catering packages through The Door Restaurant on Baisley Blvd in Queens, NY.",
  },
  {
    icon: Truck,
    title: "Delivered to Your Event",
    body: "Guests have the option to order catering directly, with food prepared and delivered to LOFT 442 on the day of the event.",
  },
  {
    icon: UtensilsCrossed,
    title: "Simple, Seamless Planning",
    body: "This allows families and event hosts to enjoy quality food while keeping the planning process simple, convenient, and seamless.",
  },
];

export default function CateringPage() {
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
                <span className="relative z-10">CATERING OPTIONS</span>
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-white/70">
                To make planning your event easier, LOFT 442 offers access to
                exclusive discounted catering packages through The Door Restaurant
                on Baisley Blvd in Queens, NY.
              </p>
            </Reveal>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-stretch lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <Reveal
              mode="text"
              delayMs={140}
              className="w-full rounded-sm border border-white/10 bg-white/6 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:p-6 md:flex md:h-full md:min-h-0 md:flex-col"
            >
              <h2 className="shrink-0 text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
                Catering Menu
              </h2>
              <FlyerViewer
                src="/images/Flyer/the-door-catering-menu.webp"
                alt="The Door Restaurant catering menu for LOFT 442 events"
                pdfHref="/images/Flyer/The Door Catering Menu.pdf"
                aspectClassName="aspect-[2/3]"
                thumbnailClassName="mx-auto max-w-[220px] sm:max-w-[260px] md:max-w-xs"
                fillHeight
                compactFillHeight
              />
            </Reveal>

            <div className="flex min-w-0 flex-col gap-6 md:h-full md:min-h-0">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="w-full text-spotlight rounded-sm border border-white/10 bg-white/8 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.45)] backdrop-blur sm:p-6 md:flex md:min-h-0 md:flex-1 md:flex-col"
                  >
                    <Icon className="h-5 w-5 text-[#d4af37]" />
                    <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-white sm:text-base">
                      {item.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {item.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Reveal
            mode="text"
            delayMs={120}
            className="about-card-outline mt-8 rounded-sm p-4 sm:mt-10 sm:p-6"
          >
            <p className="text-sm leading-relaxed text-white/75 sm:text-base">
              Whether you are hosting a repass, birthday celebration, baby
              shower, private dinner, corporate event, or special gathering, our
              catering option helps take the stress out of planning so you can
              focus on your guests and the moment.
            </p>
          </Reveal>

          <Reveal
            mode="text"
            delayMs={180}
            className="mt-8 mb-10 rounded-sm border border-white/10 bg-white/6 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur sm:mt-10 sm:p-6"
          >
            <h2 className="text-xl uppercase tracking-[0.28em] text-white sm:text-2xl">
              Learn More About Catering
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">
              For more information about catering packages, availability, and
              menu options, contact LOFT 442 and our team will help guide you
              through the process.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ContactUsLink className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-[#d4af37] px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white transition duration-300 hover:border-[#f5e6a8] hover:bg-[#d4af37]/15 hover:text-white hover:shadow-[0_0_24px_rgba(212,175,55,0.3)] sm:w-auto" />
              <Link
                href="/schedule"
                className="inline-flex h-11 w-full items-center justify-center rounded-sm border border-white/20 px-6 text-[0.65rem] uppercase tracking-[0.35em] text-white transition hover:border-white/50 hover:bg-white/10 sm:w-auto"
              >
                Start planning
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

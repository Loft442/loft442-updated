import ContactUsLink from "@/components/ContactUsLink";
import FlyerViewer from "@/components/FlyerViewer";
import Reveal from "@/components/Reveal";
import Button, { buttonClasses } from "@/components/ui/Button";

const highlights = [
  {
    title: "Our Preferred Partner",
    body: "Loft 442 hosts enjoy access to exclusive discounted catering packages through The Door Restaurant on Baisley Boulevard in Queens, New York.",
  },
  {
    title: "Prepared & Delivered",
    body: "Order directly with The Door, and your menu is prepared and delivered to Loft 442 on the day of your event.",
  },
  {
    title: "Effortless Planning",
    body: "One fewer detail to manage: exceptional food for your guests, with the arrangements kept simple and seamless.",
  },
];

export default function CateringPage() {
  return (
    <section className="border-t border-[var(--line)] pb-24 pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal mode="text" className="flex max-w-3xl flex-col gap-6">
          <p className="eyebrow">Loft 442</p>
          <h1 className="display-xl">
            Catering by our preferred partner, <em className="display-italic">The Door</em>
          </h1>
          <span className="hairline" aria-hidden="true" />
          <p className="lede">
            To make planning effortless, Loft 442 offers access to exclusive discounted catering
            packages through The Door Restaurant on Baisley Boulevard in Queens. You are, of course,
            always welcome to bring the caterer of your choice.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-16">
          <Reveal mode="text" delayMs={100} className="flex flex-col gap-6">
            <p className="eyebrow">The Menu</p>
            <FlyerViewer
              src="/images/Flyer/the-door-catering-menu.webp"
              alt="The Door Restaurant catering menu for LOFT 442 events"
              pdfHref="/images/Flyer/The Door Catering Menu.pdf"
              aspectClassName="aspect-[2/3]"
              thumbnailClassName="mx-auto max-w-[260px] md:max-w-xs"
            />
          </Reveal>

          <div className="flex flex-col border-t border-[var(--line)]">
            {highlights.map((item, index) => (
              <Reveal
                key={item.title}
                mode="text"
                delayMs={140 + index * 60}
                className="flex flex-col gap-4 border-b border-[var(--line)] py-10"
              >
                <h2 className="display-md">{item.title}</h2>
                <p className="text-[0.95rem] leading-relaxed text-white/70">{item.body}</p>
              </Reveal>
            ))}
            <p className="pt-10 text-[0.95rem] leading-relaxed text-white/60">
              Ideal for weddings, milestone celebrations, baby showers, private dinners, corporate
              events and repass receptions.
            </p>
          </div>
        </div>

        <Reveal mode="text" delayMs={180} className="mt-24 flex flex-col items-center gap-6 text-center">
          <p className="eyebrow">Menus &amp; Availability</p>
          <h2 className="display-lg max-w-2xl">Let us help you plan the menu</h2>
          <p className="lede max-w-xl">
            For package details, availability and menu options, our team will gladly guide you
            through each step.
          </p>
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Button href="/schedule">Plan Your Event</Button>
            <ContactUsLink className={buttonClasses("ghost")} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

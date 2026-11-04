import ContactUsLink from "@/components/ContactUsLink";
import FlyerViewer from "@/components/FlyerViewer";
import Reveal from "@/components/Reveal";
import Button, { buttonClasses } from "@/components/ui/Button";

const sections = [
  {
    title: "A Private, Dignified Setting",
    body: "Exclusive use of the loft gives your family a quiet space of its own. Seating, tables, a bar area and sound are in place, and the room can be arranged for an intimate gathering or a larger reception. Families are welcome to bring the caterer of their choice.",
  },
  {
    title: "Close to Home",
    body: "Loft 442 is in Elmont, a short drive for families coming from Nassau County, Queens, Brooklyn and across Long Island, and convenient to many local funeral homes.",
  },
  {
    title: "Gentle Guidance",
    body: "Every family's needs are different. From the first call to the close of the day, our team answers questions, confirms availability and attends to the arrangements with compassion and discretion.",
  },
];

export default function RepassPage() {
  return (
    <section className="border-t border-[var(--line)] pb-24 pt-16 sm:pt-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal mode="text" className="flex max-w-3xl flex-col gap-6">
          <p className="eyebrow">Loft 442</p>
          <h1 className="display-xl">Repass &amp; Celebration of Life Receptions</h1>
          <span className="hairline" aria-hidden="true" />
          <p className="lede">
            Following a funeral or memorial service, Loft 442 offers a calm, private and dignified
            space for family and friends to gather, reflect and honor a life well lived.
          </p>
          <p className="lede">
            We understand that these arrangements are often made quickly and with a heavy heart.
            Our aim is to make every step simple, so that your family can focus on being together.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-12 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-16">
          <Reveal mode="text" delayMs={100} className="flex flex-col gap-6">
            <p className="eyebrow">Repass Information</p>
            <FlyerViewer
              src="/images/Flyer/loft442-repass-flyer.webp"
              alt="LOFT 442 repass services flyer"
              pdfHref="/images/Flyer/Loft442 Repass Flyer.pdf"
              aspectClassName="aspect-[736/951]"
              thumbnailClassName="mx-0 max-w-full"
              centerDownload
            />
          </Reveal>

          <div className="flex flex-col border-t border-[var(--line)]">
            {sections.map((section, index) => (
              <Reveal
                key={section.title}
                mode="text"
                delayMs={140 + index * 60}
                className="flex flex-col gap-4 border-b border-[var(--line)] py-10"
              >
                <h2 className="display-md">{section.title}</h2>
                <p className="text-[0.95rem] leading-relaxed text-white/70">{section.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal mode="text" delayMs={180} className="mt-24 flex flex-col items-center gap-6 text-center">
          <p className="eyebrow">Availability</p>
          <h2 className="display-lg max-w-2xl">We are here when you need us</h2>
          <p className="lede max-w-xl">
            Contact our team to confirm availability, arrange a visit or talk through how we can
            support your family.
          </p>
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Button href="/schedule">Check Availability</Button>
            <ContactUsLink className={buttonClasses("ghost")} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

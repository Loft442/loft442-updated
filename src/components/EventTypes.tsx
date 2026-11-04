import { Briefcase, ChevronDown, Flower2, Gem, GlassWater } from "lucide-react";
import EventTypesAccordion, { type EventTypeEntry } from "@/components/EventTypesAccordion";

type EventType = {
  key: string;
  title: string;
  description: string;
  bodyText: string;
  icon: typeof Gem;
};

const eventTypes: EventType[] = [
  {
    key: "weddings",
    title: "Weddings",
    description: "Intimate ceremonies and receptions, composed around your vision.",
    icon: Gem,
    bodyText:
      "From the first look to the last dance, Loft 442 offers a refined, private setting for weddings of up to 125 guests. The space adapts gracefully from ceremony to dinner to celebration, with integrated lighting, sound and a fourteen-foot granite bar at its heart.\n\nOur team works alongside you and your planner on every detail, from layout and timing to vendors and set-up, so the day unfolds exactly as you imagined.",
  },
  {
    key: "private-corporate",
    title: "Private & Corporate Events",
    description: "Executive gatherings, launches and private dinners with complete discretion.",
    icon: Briefcase,
    bodyText:
      "Host leadership dinners, client receptions, product launches and private parties in a setting that reflects the standard of your organization. Two 75-inch TVs, professional audio and a flexible floor plan support presentations and celebrations alike.\n\nWith exclusive use of the loft, your guests enjoy a private, uninterrupted experience from arrival to departure.",
  },
  {
    key: "milestones",
    title: "Milestone Celebrations",
    description: "Birthdays, anniversaries, showers and family occasions, beautifully hosted.",
    icon: GlassWater,
    bodyText:
      "Milestone birthdays, anniversaries, baby showers and children's celebrations deserve a setting with presence. Loft 442 provides an elegant canvas for your décor, entertainment and catering, with four hours of complimentary set-up access before every event.\n\nWhether an intimate dinner for fifty or an evening for one hundred and twenty-five, every celebration receives the same attentive care.",
  },
  {
    key: "repass",
    title: "Repass & Celebration of Life",
    description: "A calm, private space for families to gather and remember.",
    icon: Flower2,
    bodyText:
      "Following a funeral or memorial service, Loft 442 offers families a quiet, private and dignified space to gather, reflect and honor a life well lived.\n\nWe serve families throughout Nassau County, Queens and Long Island. Families are welcome to bring outside catering, and our team attends to the arrangements with compassion and discretion.",
  },
];

// Server-rendered: the titles, icons and panel copy are plain markup handed to the
// EventTypesAccordion island, which only tracks which panel is open.
export default function EventTypes() {
  const entries: EventTypeEntry[] = eventTypes.map((event) => {
    const Icon = event.icon;

    return {
      key: event.key,
      panelId: `event-panel-${event.key}`,
      triggerId: `event-${event.key}`,
      // Keys: these elements cross the server/client boundary inside an array, so React
      // validates them like list children.
      label: (
        <div key="label" className="flex min-w-0 items-center gap-3">
          <Icon className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.25} />
          <h3 className="truncate whitespace-nowrap font-serif text-base font-normal leading-tight text-[var(--ivory)] sm:text-lg">
            {event.title}
          </h3>
        </div>
      ),
      chevron: (
        <ChevronDown
          key="chevron"
          className="h-4 w-4 shrink-0 text-white/40 transition group-hover:text-gold group-aria-expanded:rotate-180"
          strokeWidth={1.25}
        />
      ),
      body: (
        <div key="body" className="grid gap-6 md:grid-cols-[1fr_1.6fr] md:gap-12">
          <div className="flex flex-col gap-4">
            <span className="hairline" aria-hidden="true" />
            <p className="font-serif text-2xl leading-snug text-[var(--ivory)]">{event.description}</p>
          </div>
          <p className="lede whitespace-pre-line text-[0.95rem]">{event.bodyText}</p>
        </div>
      ),
    };
  });

  return (
    <section id="overview" className="scroll-mt-28 md:scroll-mt-32 section-pad">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col items-center gap-5 text-center">
          <p className="eyebrow">The Experiences</p>
          <h2 className="display-lg max-w-2xl">Occasions we are honored to host</h2>
        </div>
        <EventTypesAccordion entries={entries} />
      </div>
    </section>
  );
}

import {
  BadgeCheck,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Users2,
} from "lucide-react";

const viewingHours = [
  {
    day: "Monday",
    times: "7:00AM - 9:00AM / 6:30PM - 8:30PM",
  },
  {
    day: "Wednesday",
    times: "7:00AM - 9:00AM / 6:30PM - 8:30PM",
  },
  {
    day: "Friday",
    times: "7:00AM - 9:00AM / 6:30PM - 8:30PM",
  },
];

const contacts = [
  { name: "Andre", phone: "(347) 579-6578" },
  { name: "Alfred", phone: "(917) 496-2261" },
  { name: "Justine", phone: "(347) 975-5516" },
];

const stats = [
  {
    icon: Users2,
    eyebrow: "Up to",
    value: "125 Guests",
  },
  {
    icon: BadgeCheck,
    eyebrow: "Veteran",
    value: "Discounts",
  },
  {
    icon: MapPin,
    eyebrow: "Located in",
    value: "New York",
  },
];

function CardHeader({
  icon: Icon,
  title,
}: {
  icon: typeof Clock;
  title: string;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="reference-card-header">
        <span className="reference-card-header__line" aria-hidden="true" />
        <span className="reference-icon-ring">
          <Icon aria-hidden="true" />
        </span>
        <span className="reference-card-header__line" aria-hidden="true" />
      </div>
      <p className="text-center text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/70 sm:text-xs sm:tracking-[0.32em]">
        {title}
      </p>
    </div>
  );
}

export default function AvailabilityForm() {
  return (
    <section
      id="pricing"
      className="scroll-mt-28 section-glow pricing-glow pb-12 sm:pb-16 md:scroll-mt-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="reference-card hours-pattern hours-glow flex flex-col items-center gap-5 p-5 sm:gap-6 sm:p-6">
            <CardHeader icon={Clock} title="Viewing Hours Available" />
            <div className="flex w-full flex-col gap-2.5">
              {viewingHours.map((row) => (
                <div key={row.day} className="reference-row">
                  <Calendar className="reference-row__icon" aria-hidden="true" />
                  <span className="reference-row__label">{row.day}</span>
                  <span className="reference-row__divider" aria-hidden="true" />
                  <span className="reference-row__value">{row.times}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="reference-card hours-pattern hours-glow flex flex-col items-center gap-5 p-5 sm:gap-6 sm:p-6">
            <CardHeader icon={Phone} title="Contacts" />
            <div className="flex w-full flex-col gap-2.5">
              {contacts.map((row) => (
                <div key={row.name} className="reference-row">
                  <User className="reference-row__icon" aria-hidden="true" />
                  <span className="reference-row__label">{row.name}</span>
                  <span className="reference-row__divider" aria-hidden="true" />
                  <span className="reference-row__value reference-row__value--contact">{row.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reference-stats-band about-card-outline mt-4 sm:mt-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.value} className="reference-stat">
                <span className="reference-icon-ring">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <p className="reference-stat__eyebrow">{stat.eyebrow}</p>
                  <p className="reference-stat__value">{stat.value}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

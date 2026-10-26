import Image, { getImageProps } from "next/image";
import { ChevronDown, Gift, Heart, HeartHandshake, PartyPopper, Sparkles } from "lucide-react";
import EventTypesAccordion, { type EventTypeEntry } from "@/components/EventTypesAccordion";

const eventTypes = [
  {
    title: "Weddings",
    description:
      "A luminous loft backdrop for intimate ceremonies and unforgettable receptions.",
    icon: Heart,
  },
  {
    title: "Private Events",
    description: "Exclusive experiences tailored for your guest list.",
    icon: Sparkles,
  },
  {
    title: "Birthdays",
    description: "Modern celebrations with flexible layouts and lighting.",
    icon: Gift,
  },
  {
    title: "Kids Parties",
    description: "Stylish gatherings designed for joyful moments.",
    icon: PartyPopper,
  },
  {
    title: "Baby Shower",
    description: "Soft, elegant settings for welcoming new beginnings.",
    icon: Heart,
  },
  {
    title: "Repass Service",
    description: "A warm, private space for families to gather and honor loved ones.",
    icon: HeartHandshake,
  },
];

const iconStyles: Record<
  string,
  { color: string; glow: string; glowActive: string }
> = {
  Weddings: {
    color: "text-[#D4AF37]",
    glow: "[filter:drop-shadow(0_0_6px_rgba(212,175,55,0.35))_drop-shadow(0_0_10px_rgba(212,175,55,0.2))]",
    glowActive:
      "group-hover:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(212,175,55,0.45))_drop-shadow(0_0_14px_rgba(212,175,55,0.3))]",
  },
  "Private Events": {
    color: "text-[#2EC4FF]",
    glow: "[filter:drop-shadow(0_0_6px_rgba(46,196,255,0.35))_drop-shadow(0_0_10px_rgba(46,196,255,0.2))]",
    glowActive:
      "group-hover:[filter:drop-shadow(0_0_8px_rgba(46,196,255,0.45))_drop-shadow(0_0_14px_rgba(46,196,255,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(46,196,255,0.45))_drop-shadow(0_0_14px_rgba(46,196,255,0.3))]",
  },
  Birthdays: {
    color: "text-[#B11226]",
    glow: "[filter:drop-shadow(0_0_6px_rgba(177,18,38,0.35))_drop-shadow(0_0_10px_rgba(177,18,38,0.2))]",
    glowActive:
      "group-hover:[filter:drop-shadow(0_0_8px_rgba(177,18,38,0.45))_drop-shadow(0_0_14px_rgba(177,18,38,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(177,18,38,0.45))_drop-shadow(0_0_14px_rgba(177,18,38,0.3))]",
  },
  "Kids Parties": {
    color: "text-[#2EC4FF]",
    glow: "[filter:drop-shadow(0_0_6px_rgba(46,196,255,0.35))_drop-shadow(0_0_10px_rgba(46,196,255,0.2))]",
    glowActive:
      "group-hover:[filter:drop-shadow(0_0_8px_rgba(46,196,255,0.45))_drop-shadow(0_0_14px_rgba(46,196,255,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(46,196,255,0.45))_drop-shadow(0_0_14px_rgba(46,196,255,0.3))]",
  },
  "Baby Shower": {
    color: "text-[#E8A6B8]",
    glow: "[filter:drop-shadow(0_0_6px_rgba(232,166,184,0.35))_drop-shadow(0_0_10px_rgba(232,166,184,0.2))]",
    glowActive:
      "group-hover:[filter:drop-shadow(0_0_8px_rgba(232,166,184,0.45))_drop-shadow(0_0_14px_rgba(232,166,184,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(232,166,184,0.45))_drop-shadow(0_0_14px_rgba(232,166,184,0.3))]",
  },
  "Repass Service": {
    color: "text-[#C9B896]",
    glow: "[filter:drop-shadow(0_0_6px_rgba(201,184,150,0.35))_drop-shadow(0_0_10px_rgba(201,184,150,0.2))]",
    glowActive:
      "group-hover:[filter:drop-shadow(0_0_8px_rgba(201,184,150,0.45))_drop-shadow(0_0_14px_rgba(201,184,150,0.3))] group-focus-visible:[filter:drop-shadow(0_0_8px_rgba(201,184,150,0.45))_drop-shadow(0_0_14px_rgba(201,184,150,0.3))]",
  },
};

const panelContent: Record<
  string,
  {
    imageSrc: string;
    bodyText: string;
    panelId: string;
    triggerId: string;
    imageAlt: string;
  }
> = {
  Weddings: {
    imageSrc: "/images/feuture_0000_weding.webp",
    imageAlt: "Weddings at Loft 442",
    panelId: "event-panel-weddings",
    triggerId: "event-weddings",
    bodyText:
      "A stunning and versatile space for your special day, accommodating both intimate gatherings and grand celebrations. With elegant decor, state-of-the-art facilities, and customizable layouts, we ensure a seamless experience from ceremony to reception. Our dedicated team provides exceptional service, assisting with every detail to create a memorable atmosphere tailored to your vision. Enjoy convenient amenities, ample parking, and a prime location, making your wedding not just an event, but a cherished memory.",
  },
  "Private Events": {
    imageSrc: "/images/feuture_0002_c event.webp",
    imageAlt: "Private events at Loft 442",
    panelId: "event-panel-private-events",
    triggerId: "event-private-events",
    bodyText:
      "We are expertly designed to cater to corporate events, providing a sophisticated and versatile space for meetings, conferences, and corporate gatherings. Equipped with state-of-the-art technology and customizable layouts, we ensure a seamless experience for your attendees. Our dedicated team is committed to delivering exceptional service, from planning to execution, allowing you to focus on your event's success.\n\nWith convenient amenities and a prime location, our venue is the ideal choice for any corporate occasion.",
  },
  Birthdays: {
    imageSrc: "/images/feuture_0003_birthday.webp",
    imageAlt: "Birthdays at Loft 442",
    panelId: "event-panel-birthdays",
    triggerId: "event-birthdays",
    bodyText:
      "Celebrate your special day in style with our premier venue hall services, designed to make every birthday unforgettable. Our spacious and elegantly decorated halls can accommodate gatherings of all sizes, providing a perfect backdrop for your celebration. We ensure a seamless experience tailored to your preferences.\n\nLet our dedicated team handle the details, so you can focus on creating cherished memories with your loved ones.",
  },
  "Kids Parties": {
    imageSrc: "/images/feuture_0001_kids party.webp",
    imageAlt: "Kids parties at Loft 442",
    panelId: "event-panel-kids-parties",
    triggerId: "event-kids-parties",
    bodyText:
      "Our elegantly designed hall accommodates various group sizes, ensuring a comfortable and memorable experience for your guests. With state-of-the-art facilities, customizable layouts, and dedicated event planning support, we strive to make every celebration seamless and extraordinary.  \n\nChoose Celebrations for an unforgettable venue that transforms your vision into reality.",
  },
  "Baby Shower": {
    imageSrc: "/images/feuture_0004_baby shower.webp",
    imageAlt: "Baby shower at Loft 442",
    panelId: "event-panel-baby-shower",
    triggerId: "event-baby-shower",
    bodyText:
      "Our elegantly designed hall accommodates various group sizes, ensuring a comfortable and memorable experience for your guests. With state-of-the-art facilities, customizable layouts, and dedicated event planning support, we strive to make every celebration seamless and extraordinary. \n\nChoose Celebrations for an unforgettable venue that transforms your vision into reality.",
  },
  "Repass Service": {
    imageSrc: "/images/feuture_0002_c event.webp",
    imageAlt: "Repass services at Loft 442",
    panelId: "event-panel-repass-service",
    triggerId: "event-repass-service",
    bodyText:
      "During a difficult time, LOFT 442 provides a warm, private, and elegant space for families to gather, reflect, and honor the life of their loved one. Our venue offers comfort, privacy, and a welcoming atmosphere for family and friends following funeral or memorial services.\n\nLocated in Elmont, NY, we serve families throughout Nassau County, Queens, Long Island, and surrounding communities. Families are welcome to bring outside catering, and our team is here to help with compassionate, professional service every step of the way.",
  },
};

const PANEL_IMAGE_SIZES = "(min-width: 768px) 40vw, 100vw";

function PanelBody({ panel }: { panel: (typeof panelContent)[string] }) {
  return (
    <>
      <div className="relative h-56 w-full overflow-hidden rounded-sm border border-white/10 md:h-72">
        <Image
          src={panel.imageSrc}
          alt={panel.imageAlt}
          fill
          sizes={PANEL_IMAGE_SIZES}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
        {panel.bodyText}
      </p>
    </>
  );
}

// Server-rendered: the titles, icons and panel copy are plain markup handed to the
// EventTypesAccordion island, which only tracks which panel is open.
export default function EventTypes() {
  const entries: EventTypeEntry[] = eventTypes.map((event) => {
    const Icon = event.icon;
    const panel = panelContent[event.title];
    // Lets the island warm a panel's image on hover/focus so it is ready when the
    // panel opens, instead of downloading every panel image during first load.
    const { props: imageProps } = getImageProps({
      src: panel.imageSrc,
      alt: "",
      fill: true,
      sizes: PANEL_IMAGE_SIZES,
    });

    return {
      key: event.title,
      panelId: panel.panelId,
      triggerId: panel.triggerId,
      preload: {
        src: imageProps.src,
        srcSet: imageProps.srcSet,
        sizes: imageProps.sizes,
      },
      // Keys: these elements cross the server/client boundary inside an array, so React
      // validates them like list children.
      label: (
        <div key="label" className="flex min-w-0 items-center gap-1.5 sm:gap-2 lg:gap-1.5 xl:gap-2">
          <Icon
            className={`h-4 w-4 shrink-0 sm:h-5 sm:w-5 lg:h-4 lg:w-4 xl:h-5 xl:w-5 ${iconStyles[event.title]?.color ?? "text-white/80"
              } ${iconStyles[event.title]?.glow ?? ""} ${iconStyles[event.title]?.glowActive ?? ""
              }`}
          />
          <h3 className="truncate text-xs font-semibold tracking-[0.08em] text-white sm:text-xs sm:tracking-[0.1em] lg:text-[0.7rem] xl:text-sm xl:tracking-[0.12em]">
            {event.title}
          </h3>
        </div>
      ),
      chevron: (
        <ChevronDown key="chevron" className="h-3 w-3 shrink-0 text-white/45 transition group-hover:text-white/65 group-aria-expanded:rotate-180 sm:h-3.5 sm:w-3.5 lg:h-3 lg:w-3 xl:h-4 xl:w-4" />
      ),
      body: <PanelBody key="body" panel={panel} />,
    };
  });

  return (
    <section
      id="overview"
      className="scroll-mt-28 md:scroll-mt-32 section-glow section-divider -mt-[clamp(76px,12vh,180px)] pb-8 sm:pb-10 pt-[calc(4rem+clamp(76px,12vh,180px))] sm:pt-[calc(5rem+clamp(76px,12vh,180px))]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <EventTypesAccordion entries={entries} />
      </div>
    </section>
  );
}

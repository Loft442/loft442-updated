"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Gift, Heart, PartyPopper, Sparkles } from "lucide-react";

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
};

type PanelKey =
  | "Weddings"
  | "Private Events"
  | "Birthdays"
  | "Kids Parties"
  | "Baby Shower";

const panelContent: Record<
  PanelKey,
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
};

export default function EventTypes() {
  const [openKey, setOpenKey] = useState<PanelKey | null>(null);
  const [renderKey, setRenderKey] = useState<PanelKey | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const expandableKeys: PanelKey[] = [
    "Weddings",
    "Private Events",
    "Birthdays",
    "Kids Parties",
    "Baby Shower",
  ];

  // Open a panel - called from event handler
  const handleOpenPanel = useCallback((key: PanelKey) => {
    // Clear any pending close timer
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenKey(key);
    setRenderKey(key);
    requestAnimationFrame(() => setIsPanelOpen(true));
  }, []);

  // Close the panel - called from event handler
  const handleClosePanel = useCallback(() => {
    setOpenKey(null);
    setIsPanelOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setRenderKey(null);
      closeTimerRef.current = null;
    }, 500);
  }, []);

  // Toggle panel
  const handleTogglePanel = useCallback((key: PanelKey) => {
    if (openKey === key) {
      handleClosePanel();
    } else {
      handleOpenPanel(key);
    }
  }, [openKey, handleOpenPanel, handleClosePanel]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <section
      id="overview"
      className="scroll-mt-28 md:scroll-mt-32 section-glow section-divider -mt-[clamp(76px,12vh,180px)] py-16 sm:py-20 pt-[calc(4rem+clamp(76px,12vh,180px))] sm:pt-[calc(5rem+clamp(76px,12vh,180px))]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {eventTypes.map((event) => {
            const Icon = event.icon;
            const isExpandable = expandableKeys.includes(event.title as PanelKey);
            const panelKey = isExpandable ? (event.title as PanelKey) : null;
            const isExpanded = panelKey ? openKey === panelKey : false;
            const panelMeta = panelKey ? panelContent[panelKey] : null;
            const panelControls = panelMeta
              ? `${panelMeta.panelId} ${panelMeta.panelId}-mobile`
              : undefined;

            return (
              <div key={event.title} className="flex flex-col">
                <button
                  type="button"
                  aria-expanded={isExpandable ? isExpanded : undefined}
                  aria-controls={panelControls}
                  id={panelMeta?.triggerId}
                  onClick={() => {
                    if (panelKey) {
                      handleTogglePanel(panelKey);
                    }
                  }}
                  className="about-card-outline group relative flex min-w-0 min-h-12 items-center justify-between gap-3 rounded-sm p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Icon
                      className={`h-6 w-6 ${iconStyles[event.title]?.color ?? "text-white/80"
                        } ${iconStyles[event.title]?.glow ?? ""} ${iconStyles[event.title]?.glowActive ?? ""
                        }`}
                    />
                    <h3 className="truncate text-sm font-semibold tracking-[0.14em] text-white whitespace-nowrap">
                      {event.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-white/50 transition group-hover:text-white/70 ${isExpanded ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {renderKey === panelKey && panelMeta ? (
                  <div
                    className={`mt-4 overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] md:hidden ${isPanelOpen
                      ? "max-h-[900px] translate-y-0 opacity-100"
                      : "max-h-0 -translate-y-1 opacity-0"
                      }`}
                    aria-hidden={!isPanelOpen}
                  >
                    <div
                      id={`${panelMeta.panelId}-mobile`}
                      role="region"
                      aria-labelledby={panelMeta.triggerId}
                      className="grid gap-6 rounded-sm border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2"
                    >
                      <div className="relative h-56 w-full overflow-hidden rounded-sm border border-white/10 md:h-72">
                        <Image
                          src={panelMeta.imageSrc}
                          alt={panelMeta.imageAlt}
                          fill
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      </div>
                      <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
                        {panelMeta.bodyText}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        {renderKey ? (
          <div
            className={`mt-6 hidden overflow-hidden transition-[max-height,opacity,transform] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] md:block ${isPanelOpen
              ? "max-h-[900px] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-1 opacity-0"
              }`}
            aria-hidden={!isPanelOpen}
          >
            <div
              id={panelContent[renderKey].panelId}
              role="region"
              aria-labelledby={panelContent[renderKey].triggerId}
              className="grid gap-6 rounded-sm border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2"
            >
              <div className="relative h-56 w-full overflow-hidden rounded-sm border border-white/10 md:h-72">
                <Image
                  src={panelContent[renderKey].imageSrc}
                  alt={panelContent[renderKey].imageAlt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
                {panelContent[renderKey].bodyText}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

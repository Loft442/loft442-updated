import { SITE_ADDRESS, SITE_EMAIL, SITE_URL } from "@/lib/seo";

// Registration values must match the SAM.gov entity record exactly. Empty values are
// left off the public page rather than shown blank.
export const COMPANY_DATA = {
  legalName: "",
  dba: "LOFT 442",
  uei: "",
  cageCode: "",
  naicsCodes: [] as { code: string; title: string }[],
  pscCodes: [] as string[],
  certifications: [] as string[],
  socioeconomic: ["Veteran-owned and operated"],
  paymentMethods: [] as string[],
  yearEstablished: "",
};

export const PRIMARY_CONTACT = {
  name: "Andre",
  title: "",
  phone: "(347) 579-6578",
  tel: "+13475796578",
  email: SITE_EMAIL,
};

export const COMPANY_ADDRESS = `${SITE_ADDRESS.streetAddress}, ${SITE_ADDRESS.addressLocality}, ${SITE_ADDRESS.addressRegion} ${SITE_ADDRESS.postalCode}`;
export const COMPANY_WEBSITE = SITE_URL.replace(/^https?:\/\//, "");

export const OVERVIEW =
  "LOFT 442 is a veteran-owned private event venue in Elmont, New York, on the border of Queens and Nassau County. The loft accommodates up to 125 guests with exclusive use of the space, included furnishings and audio-visual equipment, and an on-site team from set-up to close. We provide agencies and public offices with a turnkey, professional setting for ceremonies, meetings, trainings and receptions.";

export const CORE_COMPETENCIES = [
  {
    title: "Ceremonies & Recognition",
    body: "Award ceremonies, promotions, retirements, swearing-in and recognition events for up to 125 guests.",
  },
  {
    title: "Meetings & Trainings",
    body: "Briefings, trainings, community meetings and town halls, with two 75-inch multimedia displays and an installed sound system.",
  },
  {
    title: "Receptions & Functions",
    body: "Holiday functions, employee appreciation events, receptions, and repass and memorial gatherings.",
  },
  {
    title: "Turnkey Event Support",
    body: "Tables, Chiavari seating and linens included; catering coordinated through our preferred partner or an approved caterer; servers and bartenders available.",
  },
];

export const DIFFERENTIATORS = [
  "Veteran-owned and operated, with discounts for active and retired military and first responders.",
  "Exclusive use: one event at a time, with a dedicated member of our team on site throughout.",
  "Six-hour rental with four hours of complimentary early access for set-up.",
  "Furnishings, audio-visual equipment, a 14-foot bar and food-service equipment included.",
  "Minutes from Queens at the gateway to Long Island, with an adjacent parking lot and street parking.",
];

export const CAPABILITY_IMAGES = [
  {
    src: "/images/capability/image-11-enhanced.webp",
    alt: "Loft 442 grand opening with honor guard, balloon columns and a Grand Opening banner at the entrance",
    caption: "Grand opening at Loft 442",
    objectPosition: "50% 45%",
  },
  {
    src: "/images/capability/ribbon3.webp",
    alt: "Town of Hempstead officials cutting the ribbon with the Loft 442 team",
    caption: "Ribbon cutting with the Town of Hempstead",
    objectPosition: "50% 45%",
  },
  {
    src: "/images/capability/military-ex.webp",
    alt: "A military honor guard presenting the colors at the Loft 442 grand opening",
    caption: "Honor guard at our grand opening",
    objectPosition: "60% 40%",
  },
];

export const VENUE_SPECS = [
  { label: "Capacity", value: "Up to 125 guests" },
  { label: "Rental", value: "6 hours, plus 4 hours set-up access" },
  { label: "Audio-visual", value: "Two 75\" displays, installed sound system" },
  { label: "Furnishings", value: "Up to 100 Chiavari chairs, round and rectangular tables, linens" },
  { label: "Food service", value: "Refrigerator, food warmer, ice bin, bar sink" },
  { label: "Parking", value: "Adjacent lot and street parking" },
];

// Only list engagements that can be referenced; the section is hidden while this is empty.
export const PAST_PERFORMANCE: { client: string; description: string; period?: string }[] = [];

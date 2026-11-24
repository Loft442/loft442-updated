export const venuePackages = [
  {
    name: "The Essential",
    price: "3,700",
    guests: "Up to 50 guests",
    maxGuests: 50,
    summary: "An intimate setting for dinners, showers and close-knit celebrations.",
    imageSrc: "/images/essential-blue-moon.webp",
    imageAlt: "The Essential package: elegant blue moon baby shower décor at Loft 442",
    items: ["50 clear Chiavari chairs", "5 round or cocktail tables", "3 rectangular tables"],
  },
  {
    name: "The Grand",
    price: "4,200",
    guests: "Up to 125 guests",
    maxGuests: 125,
    summary: "The full loft, arranged for weddings, receptions and landmark evenings.",
    imageSrc: "/images/grand-image-8.webp",
    imageAlt: "The Grand package: the Loft 442 salon styled for a celebration",
    items: ["100 clear Chiavari chairs", "10 round or cocktail tables", "6 rectangular tables"],
  },
] as const;

export const startingPackagePrice = venuePackages[0].price;
export const maxGuestCount = venuePackages[venuePackages.length - 1].maxGuests;

export const dateRequestNote =
  "Choose a date and send your details. We confirm availability.";

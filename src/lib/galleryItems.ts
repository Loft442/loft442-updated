export type GalleryItemCategory = "Weddings" | "Private Events" | "Birthdays" | "Kids Parties" | "Baby Shower";

export type GalleryItem = {
  id: number | string;
  src: string;
  alt: string;
  category: GalleryItemCategory;
  /** Defaults to "image". Videos come from client uploads in the Studio. */
  type?: "image" | "video";
  /** Cover image for videos. */
  poster?: string;
};

const G = "/images/gallery";

export const galleryItems: GalleryItem[] = [
  // Private Events — pinned to the top of the All tab
  {
    id: 10,
    src: `${G}/private-event3-pink-and-gold-tablescape.webp`,
    alt: "Pink and gold tablescape for a private event at Loft 442",
    category: "Private Events",
  },
  {
    id: 11,
    src: `${G}/casino-themed-bar.webp`,
    alt: "Casino-themed bar setup at Loft 442",
    category: "Private Events",
  },
  {
    id: 12,
    src: `${G}/purple-and-gold-cake.webp`,
    alt: "Purple and gold celebration cake at Loft 442",
    category: "Private Events",
  },
  {
    id: 13,
    src: `${G}/image-1.webp`,
    alt: "Event space at Loft 442",
    category: "Private Events",
  },
  {
    id: 14,
    src: `${G}/image-2.webp`,
    alt: "Celebration setup at Loft 442",
    category: "Private Events",
  },
  {
    id: 15,
    src: `${G}/image-3.webp`,
    alt: "Venue details at Loft 442",
    category: "Private Events",
  },
  {
    id: 16,
    src: `${G}/image-4.webp`,
    alt: "Private gathering at Loft 442",
    category: "Private Events",
  },
  {
    id: 17,
    src: `${G}/image-5.webp`,
    alt: "Loft 442 event salon",
    category: "Private Events",
  },
  {
    id: 18,
    src: `${G}/image-6.webp`,
    alt: "Evening event at Loft 442",
    category: "Private Events",
  },
  {
    id: 19,
    src: `${G}/image-7.webp`,
    alt: "Reception floor at Loft 442",
    category: "Private Events",
  },
  {
    id: 20,
    src: `${G}/image-8.webp`,
    alt: "Decorated tables at Loft 442",
    category: "Private Events",
  },
  {
    id: 21,
    src: `${G}/image-9.webp`,
    alt: "Private celebration at Loft 442",
    category: "Private Events",
  },
  {
    id: 22,
    src: `${G}/image-12.webp`,
    alt: "Event lighting at Loft 442",
    category: "Private Events",
  },
  {
    id: 23,
    src: `${G}/image-13.webp`,
    alt: "Venue atmosphere at Loft 442",
    category: "Private Events",
  },

  // Weddings
  {
    id: 1,
    src: `${G}/wedding9-reception-room.webp`,
    alt: "Wedding reception room at Loft 442 with white and gold décor",
    category: "Weddings",
  },
  {
    id: 2,
    src: `${G}/wedding5-white-and-gold-tables.webp`,
    alt: "White and gold wedding tables at Loft 442",
    category: "Weddings",
  },
  {
    id: 3,
    src: `${G}/wedding6-sweetheart-table.webp`,
    alt: "Sweetheart table at a Loft 442 wedding",
    category: "Weddings",
  },
  {
    id: 4,
    src: `${G}/wedding2-reception-candid.webp`,
    alt: "Wedding reception candid at Loft 442",
    category: "Weddings",
  },

  // Birthdays
  {
    id: 30,
    src: `${G}/birthday4.webp`,
    alt: "Birthday celebration at Loft 442",
    category: "Birthdays",
  },
  {
    id: 31,
    src: `${G}/birthday5.webp`,
    alt: "Birthday party setup at Loft 442",
    category: "Birthdays",
  },
  {
    id: 32,
    src: `${G}/birthday19-ice-sculpture.webp`,
    alt: "Birthday ice sculpture at Loft 442",
    category: "Birthdays",
  },

  // Baby Shower
  {
    id: 40,
    src: `${G}/bearly-wait-baby-shower.webp`,
    alt: "Bearly Wait baby shower at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 41,
    src: `${G}/lavender-tea-party-backdrop.webp`,
    alt: "Lavender tea party backdrop for a baby shower at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 42,
    src: `${G}/lavender-tea-party-tablescape.webp`,
    alt: "Lavender tea party tablescape at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 43,
    src: `${G}/pink-rose-centerpiece.webp`,
    alt: "Pink rose centerpiece at a Loft 442 baby shower",
    category: "Baby Shower",
  },
  {
    id: 44,
    src: `${G}/babyshower6.webp`,
    alt: "Baby shower celebration at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 45,
    src: `${G}/babyshower9.webp`,
    alt: "Baby shower décor at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 46,
    src: `${G}/babyshower10.webp`,
    alt: "Baby shower photoshoot at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 47,
    src: `${G}/babyshower13.webp`,
    alt: "Baby shower gathering at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 48,
    src: `${G}/babyshower14.webp`,
    alt: "Baby shower setup at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 49,
    src: `${G}/babyshower16.webp`,
    alt: "Baby shower party at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 50,
    src: `${G}/babyshower18.webp`,
    alt: "Baby shower venue at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 51,
    src: `${G}/babyshower20.webp`,
    alt: "Baby shower event at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 52,
    src: `${G}/babyshower21.webp`,
    alt: "Baby shower celebration setup at Loft 442",
    category: "Baby Shower",
  },
  {
    id: 53,
    src: `${G}/babyshower35.webp`,
    alt: "Baby shower atmosphere at Loft 442",
    category: "Baby Shower",
  },
];

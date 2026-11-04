// The website gallery's categories, in the same order and with the same names as the
// tabs on /gallery (src/components/GalleryPage.tsx). Values are what's stored on each
// item and must match GalleryItemCategory in src/lib/galleryItems.ts.
export const GALLERY_CATEGORIES = [
  { value: "Weddings", title: "Weddings", alt: "Wedding celebration at Loft 442" },
  { value: "Private Events", title: "Private Events", alt: "Private event at Loft 442" },
  { value: "Birthdays", title: "Birthdays", alt: "Birthday celebration at Loft 442" },
  { value: "Baby Shower", title: "Baby Showers", alt: "Baby shower at Loft 442" },
] as const;

export type GalleryCategoryValue = (typeof GALLERY_CATEGORIES)[number]["value"];

export const defaultAltFor = (value: GalleryCategoryValue) =>
  GALLERY_CATEGORIES.find((c) => c.value === value)?.alt ?? "Celebration at Loft 442";

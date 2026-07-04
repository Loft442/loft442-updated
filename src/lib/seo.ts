import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://loft442.com";
export const SITE_NAME = "LOFT 442";
export const SITE_DESCRIPTION =
  "LOFT 442 is a veteran-owned event venue designed for elegant weddings, corporate events, repass gatherings, and private celebrations in Elmont, NY.";
export const SITE_EMAIL = "events@loft442.com";
export const SITE_PHONE = "+1-555-123-4420";
export const SITE_INSTAGRAM = "https://www.instagram.com/loft.442/";

export const SITE_ADDRESS = {
  streetAddress: "784 Elmont Rd",
  addressLocality: "Elmont",
  addressRegion: "NY",
  postalCode: "11003",
  addressCountry: "US",
} as const;

export const SITE_GEO = {
  latitude: 40.6911699,
  longitude: -73.7207723,
} as const;

export const DEFAULT_OG_IMAGE = "/opengraph-image";

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  robots?: Metadata["robots"];
};

export function absoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  keywords = [],
  robots,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: `${title} | ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots,
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    sameAs: [SITE_INSTAGRAM],
    address: {
      "@type": "PostalAddress",
      ...SITE_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_GEO.latitude,
      longitude: SITE_GEO.longitude,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Nassau County, NY" },
      { "@type": "AdministrativeArea", name: "Queens, NY" },
      { "@type": "AdministrativeArea", name: "Long Island, NY" },
    ],
  };
}

type ServiceJsonLdOptions = {
  name: string;
  description: string;
  serviceType: string;
  url: string;
  areaServed?: string[];
};

export function serviceJsonLd({
  name,
  description,
  serviceType,
  url,
  areaServed = [
    "Nassau County, NY",
    "Queens, NY",
    "Long Island, NY",
    "Brooklyn, NY",
  ],
}: ServiceJsonLdOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url,
    provider: {
      "@type": "EventVenue",
      name: SITE_NAME,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        ...SITE_ADDRESS,
      },
    },
    areaServed: areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };
}

export const PUBLIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/repass", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/catering", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/availability", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/booking", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/schedule", priority: 0.7, changeFrequency: "monthly" as const },
];

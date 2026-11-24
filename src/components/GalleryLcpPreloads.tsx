import { getImageProps } from "next/image";
import type { GalleryItem } from "@/lib/galleryItems";

/**
 * Server-emitted preloads for the first gallery tiles (same order as the All
 * tab after Private Events pin). Makes LCP candidates discoverable in HTML
 * before the client masonry measures.
 */
export default function GalleryLcpPreloads({ items }: { items: GalleryItem[] }) {
  const ordered = [...items].reverse().sort((a, b) => {
    const aPrivate = a.category === "Private Events" ? 0 : 1;
    const bPrivate = b.category === "Private Events" ? 0 : 1;
    return aPrivate - bPrivate;
  });

  const preloads = ordered.slice(0, 4).flatMap((item, index) => {
    if (item.type === "video") {
      if (!item.poster) return [];
      const { props } = getImageProps({
        alt: "",
        width: 400,
        height: 500,
        sizes:
          "(max-width: 400px) 50vw, (max-width: 600px) 33vw, (max-width: 1000px) 25vw, 20vw",
        quality: 70,
        src: item.poster,
      });
      return [
        <link
          key={`gallery-lcp-${item.id}`}
          rel="preload"
          as="image"
          imageSrcSet={props.srcSet}
          imageSizes={props.sizes}
          fetchPriority={index === 0 ? "high" : "low"}
        />,
      ];
    }

    const { props } = getImageProps({
      alt: "",
      width: 400,
      height: 500,
      sizes:
        "(max-width: 400px) 50vw, (max-width: 600px) 33vw, (max-width: 1000px) 25vw, 20vw",
      quality: 70,
      src: item.src,
    });

    return [
      <link
        key={`gallery-lcp-${item.id}`}
        rel="preload"
        as="image"
        imageSrcSet={props.srcSet}
        imageSizes={props.sizes}
        fetchPriority={index === 0 ? "high" : "low"}
      />,
    ];
  });

  return <>{preloads}</>;
}

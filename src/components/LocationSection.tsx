"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

export default function LocationSection() {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  // iOS Safari-safe IntersectionObserver
  useEffect(() => {
    const node = mapRef.current;
    if (!node) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: load immediately if IntersectionObserver not available
      // Using callback ref pattern to avoid lint warning
      requestAnimationFrame(() => setShouldLoadMap(true));
      return;
    }

    // Use smaller rootMargin for iOS Safari compatibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setShouldLoadMap(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px 0px", // Reduced from 600px for iOS Safari
        threshold: 0.01 // Lower threshold for earlier detection
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const handleMapError = useCallback(() => {
    setHasMapError(true);
    setIsMapLoaded(true); // Hide loading state
  }, []);

  return (
    <section className="section-glow section-divider border-t border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
          {/* Map container with fixed aspect ratio to prevent CLS */}
          <div
            ref={mapRef}
            className="relative overflow-hidden rounded-sm border border-white/10 bg-black/60 shadow-[0_0_20px_rgba(255,255,255,0.12),0_0_32px_rgba(59,130,246,0.06),0_0_32px_rgba(239,68,68,0.06),0_25px_70px_rgba(0,0,0,0.45)] transition duration-200 ease-out hover:shadow-[0_0_32px_rgba(255,255,255,0.22),0_0_48px_rgba(59,130,246,0.1),0_0_48px_rgba(239,68,68,0.1),0_25px_70px_rgba(0,0,0,0.45)] focus-within:shadow-[0_0_32px_rgba(255,255,255,0.22),0_0_48px_rgba(59,130,246,0.1),0_0_48px_rgba(239,68,68,0.1),0_25px_70px_rgba(0,0,0,0.45)]"
            style={{ aspectRatio: "16/9", minHeight: "240px" }}
          >
            {/* Always show placeholder first for CLS prevention */}
            <div
              className={`absolute inset-0 z-10 transition-opacity duration-500 ease-out ${isMapLoaded && !hasMapError ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
            >
              <Image
                src="/google-embed.png"
                alt="Loft 442 location on map"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={false}
                loading="eager"
              />
            </div>

            {/* Lazy-loaded iframe */}
            {shouldLoadMap && !hasMapError && (
              <iframe
                title="Loft 442 location map"
                src="https://www.google.com/maps?q=LOFT+442%2C+784+Elmont+Rd%2C+Elmont+NY+11003&output=embed"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={handleMapLoad}
                onError={handleMapError}
                style={{ border: 0 }}
              />
            )}

            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          <div>
            <div className="text-spotlight inline-block rounded-sm px-4 py-3">
              <div className="flex flex-col gap-4">
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  LOCATION
                </p>
                <div className="flex flex-col gap-1 text-lg leading-relaxed text-white/85">
                  <p>Loft 442</p>
                  <p>
                    784 Elmont Road, Elmont,
                    <br />
                    NY 11003
                  </p>
                </div>
                <Link
                  href="https://www.google.com/maps/place/LOFT+442/@40.6911659,-73.7213089,19.25z/data=!4m15!1m8!3m7!1s0x89c26393a45415bd:0xd22bc228f411a3f4!2s784+Elmont+Rd,+Elmont,+NY+11003!3b1!8m2!3d40.6911699!4d-73.7207723!16s%2Fg%2F11x6sc7qp4!3m5!1s0x89c263c43c7a2f79:0x821fdd056c00687d!8m2!3d40.6911699!4d-73.7207723!16s%2Fg%2F11wx_gcp51?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDExOS4wIKXMDSoASAFQAw%3D%3D"
                  className="text-xs uppercase tracking-[0.35em] text-white/70 transition hover:text-white"
                >
                  Open in Maps
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

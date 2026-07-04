import MarqueeRail from "@/components/MarqueeRail";
import { galleryItems } from "@/lib/galleryItems";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Motion Rails",
  description: "Internal motion rail demo for LOFT 442.",
  path: "/motion",
  robots: {
    index: false,
    follow: false,
  },
});

const railItems = galleryItems.map((item) => ({
  src: item.src,
  alt: item.alt,
}));

const railA = railItems;

function RailRow({
  items,
  direction,
}: {
  items: { src: string; alt: string }[];
  direction: "left" | "right";
}) {
  return (
    <>
      <div className="pointer-events-none sm:hidden">
        <MarqueeRail
          items={items}
          direction={direction}
          speedSec={100}
          heightPx={120}
          gapPx={12}
        />
      </div>
      <div className="pointer-events-none hidden sm:block">
        <MarqueeRail
          items={items}
          direction={direction}
          speedSec={100}
          heightPx={176}
          gapPx={16}
        />
      </div>
    </>
  );
}

export default function MotionPage() {
  return (
    <div className="min-h-screen bg-[#070708] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h1
            className="text-2xl font-semibold sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Motion Rails
          </h1>
          <p className="mt-2 text-sm text-white/70 sm:text-base">
            Smooth, GPU-friendly image marquees tuned for iOS Safari.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          <RailRow items={railA} direction="left" />
        </div>
      </div>
    </div>
  );
}

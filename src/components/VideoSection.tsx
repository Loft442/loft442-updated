import Carousel from "@/components/Carousel";
import Button from "@/components/ui/Button";

export default function VideoSection() {
  return (
    <section id="video-section" className="section-pad border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Moments</p>
            <h2 className="display-lg max-w-xl">Celebrations at Loft 442</h2>
          </div>
          <p className="lede max-w-sm">
            Weddings, milestones and private evenings, each one shaped by the people who gathered.
          </p>
        </div>
        <Carousel />
        <div className="mt-12 flex justify-center">
          <Button href="/gallery" variant="ghost">
            View the Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Flag, Tag } from "lucide-react";

export default function VeteranBanner() {
  return (
    <section className="border-y border-white/10 bg-gradient-to-r from-neutral-900/80 via-black to-neutral-900/80">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-12 text-center">
        <div className="flex items-center gap-3 text-white/80">
          <Flag className="h-6 w-6" />
          <Tag className="h-6 w-6" />
        </div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">
          VETERAN OWNED & OPERATED
        </p>
        <p className="text-lg text-white/80">
          Proudly Serving Those Who Served
        </p>
      </div>
    </section>
  );
}

import AvailabilityForm from "@/components/AvailabilityForm";
import CTA from "@/components/CTA";
import EventTypes from "@/components/EventTypes";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";

export default function HomePage() {
  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <div className="divider-glow h-[2px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <Hero />
      <EventTypes />
      <AvailabilityForm />
      <Features />
      <FAQ />
      <CTA />
      <LocationSection />
      <Footer />
    </main>
  );
}


import AvailabilityForm from "@/components/AvailabilityForm";
import BookingBanner from "@/components/BookingBanner";
import CTA from "@/components/CTA";
import EventTypes from "@/components/EventTypes";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import Testimonials from "@/components/Testimonials";
import VideoSection from "@/components/VideoSection";

export default function HomePage() {
  return (
    <main className="ambient-surface bg-black pt-[76px] text-white">
      <div className="ambient-glow" aria-hidden="true">
        <span className="ambient-glow__layer" />
      </div>
      <BookingBanner />
      <Hero />
      <EventTypes />
      <AvailabilityForm />
      <VideoSection />
      <Features />
      <FAQ />
      <Testimonials />
      <CTA />
      <LocationSection />
      <Footer />
    </main>
  );
}

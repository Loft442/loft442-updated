import AvailabilityForm from "@/components/AvailabilityForm";
import EventTypes from "@/components/EventTypes";
import FAQ from "@/components/FAQ";
import { AboutSection, StandardSection, TributeSection } from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import Testimonials from "@/components/Testimonials";
import VideoSection from "@/components/VideoSection";

// Instagram Graph API feed is paused. Render InstagramSection here again to turn it back on.

export default function HomePage() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <Hero />
      <AboutSection />
      <EventTypes />
      <AvailabilityForm />
      <StandardSection />
      <TributeSection />
      <Testimonials />
      <FAQ />
      <VideoSection />
      <LocationSection />
      <Footer />
    </main>
  );
}

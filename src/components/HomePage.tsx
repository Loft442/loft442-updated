import dynamic from "next/dynamic";
import AvailabilityForm from "@/components/AvailabilityForm";
import EventTypes from "@/components/EventTypes";
import { AboutSection, StandardSection, TributeSection } from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import VideoSection from "@/components/VideoSection";

// Below-fold sections: keep SSR markup, split their client JS out of the first paint.
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const LocationSection = dynamic(() => import("@/components/LocationSection"));

// Instagram Graph API feed is paused. Render InstagramSection here again to turn it back on.

export default function HomePage() {
  return (
    <main className="home-page bg-[var(--background)] pt-nav text-white">
      <Hero />
      <AboutSection />
      <EventTypes />
      <VideoSection />
      <AvailabilityForm />
      <StandardSection />
      <TributeSection />
      <Testimonials />
      <FAQ />
      <LocationSection />
      <Footer />
    </main>
  );
}

import { Suspense } from "react";
import AvailabilityForm from "@/components/AvailabilityForm";
import BookingBanner from "@/components/BookingBanner";
import EventTypes from "@/components/EventTypes";
import FAQ from "@/components/FAQ";
import { AboutSection, StandardSection, TributeSection } from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InstagramSection, {
  InstagramSectionSkeleton,
} from "@/components/InstagramSection";
import LocationSection from "@/components/LocationSection";
import Testimonials from "@/components/Testimonials";
import VideoSection from "@/components/VideoSection";

export default function HomePage() {
  return (
    <main className="bg-[var(--background)] pt-nav text-white">
      <BookingBanner />
      <Hero />
      <AboutSection />
      <EventTypes />
      <VideoSection />
      <StandardSection />
      <TributeSection />
      <Testimonials />
      <Suspense fallback={<InstagramSectionSkeleton />}>
        <InstagramSection />
      </Suspense>
      <FAQ />
      <AvailabilityForm />
      <LocationSection />
      <Footer />
    </main>
  );
}

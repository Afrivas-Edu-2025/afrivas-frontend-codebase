"use client"

// Removed import of about route page to avoid importing page components directly
import {
  HeroSection,
  UserRolesSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  FAQSection,
  CTASection, 
  ContactSection,
  ScrollToTopButton
} from "@/components/landing"

export default function Home() {
  return (
    <div className="min-h-screen">


      <ScrollToTopButton />

      <main className="flex-1">
        <HeroSection />
        <UserRolesSection />
        <FeaturesSection />
        {/* Removed AboutPage to prevent importing a route component */}
        <HowItWorksSection />
        {/* <TestimonialsSection /> */}
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
    </div>
  )
}

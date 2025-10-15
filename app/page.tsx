"use client"

import Navbar from "@/components/Navbar"
import AboutPage from "./(pages)/about/page"
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
      <div className="navbar">
        <Navbar />
      </div>

      <ScrollToTopButton />

      <main className="flex-1">
        <HeroSection />
        <UserRolesSection />
        <FeaturesSection />
        <AboutPage />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
    </div>
  )
}

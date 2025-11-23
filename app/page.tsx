"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

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
  ScrollToTopButton,
} from "@/components/landing"

export default function Home() {
  const { user, token, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && token && user?.role === "ADMIN") {
      router.replace("/admin/dashboard")
    }
  }, [loading, token, user, router])

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

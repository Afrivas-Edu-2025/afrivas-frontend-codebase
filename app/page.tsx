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
    if (!loading && token && user?.role) {
      const role = String(user.role).toUpperCase();
      const routeMap: Record<string, string> = {
        ADMIN: "/admin/dashboard",
        SUPER_ADMIN: "/super-admin/dashboard",
        STAFF: "/staff/dashboard",
        STUDENT: "/student/dashboard",
        LECTURER: "/lecturer/dashboard",
      };
      const dest = routeMap[role];
      if (dest) router.replace(dest);
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

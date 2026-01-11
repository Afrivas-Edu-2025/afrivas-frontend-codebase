"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/ui/auth-form"
import { useAuth } from "@/components/auth-context"

export default function StudentLoginPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && token && user) {
      if (user.role === "SUPER_ADMIN") {
        router.replace("/super-admin/dashboard")
      } else if (user.role === "UNIVERSITY_ADMIN" || user.role === "ADMIN") {
        router.replace("/admin/dashboard")
      } else if (user.role === "STUDENT") {
        router.replace("/student/dashboard")
      } else if (user.role === "LECTURER") {
        router.replace("/lecturer/dashboard")
      }
    }
  }, [loading, token, user, router])

  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-6xl">
      <AuthForm />
    </div>
  )
}

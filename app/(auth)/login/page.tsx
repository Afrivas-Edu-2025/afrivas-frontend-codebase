"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/ui/auth-form"
import { useAuth } from "@/components/auth-context"

export default function StudentLoginPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && token && user?.role) {
      const role = String(user.role).toUpperCase();
      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
      } else if (role === "SUPER_ADMIN") {
        router.replace("/super-admin/dashboard");
      } else if (role === "STAFF") {
        router.replace("/staff/dashboard");
      } else if (role === "STUDENT") {
        router.replace("/student/dashboard");
      } else if (role === "LECTURER") {
        router.replace("/lecturer/dashboard");
      }
    }
  }, [loading, token, user, router])

  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-6xl">
      <AuthForm />
    </div>
  )
}

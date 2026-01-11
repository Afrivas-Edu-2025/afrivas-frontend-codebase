"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthForm } from "@/components/ui/auth-form"
import { useAuth } from "@/components/auth-context"

export default function StudentLoginPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && token) {
      router.replace("/profile")
    }
  }, [loading, token, user, router])

  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-6xl">
      <AuthForm />
    </div>
  )
}

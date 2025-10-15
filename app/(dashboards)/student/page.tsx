"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Student() {
  const router = useRouter()

  useEffect(() => {
    router.push("/student/dashboard")
  }, [router])

  return (
    <>
      <p>Loading...</p>
    </>
  )
}

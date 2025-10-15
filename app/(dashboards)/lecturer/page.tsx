"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Teachers() {
  const router = useRouter()

  useEffect(() => {
    router.push("/teacher/dashboard")
  }, [router])

  return (
    <>
      <p>Loading...</p>
    </>
  )
}

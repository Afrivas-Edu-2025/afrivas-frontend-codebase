"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Teachers() {
  const router = useRouter()

  useEffect(() => {
    router.push("/lecturer/dashboard")
  }, [router])

  return (
    <>
      <p>Loading...</p>
    </>
  )
}

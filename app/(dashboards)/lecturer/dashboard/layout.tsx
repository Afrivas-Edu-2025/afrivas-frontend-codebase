import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ePlatform - Lecturer Dashboard",
  description: "Lecturer portal for the educational platform",
}

export default function LecturerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

import { Toaster } from "@/components/ui/toaster"
import type React from "react"
// import ReduxProvider from '@/components/ReduxProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <ReduxProvider>
    <div>
      <div className="flex items-center flex-col justify-center min-h-screen bg-white/85 dark:bg-gray-700 px-4 pt-24">
        {/* <Navbar />9 */}
        <div className="mb-8">
          <a href="/" className="flex items-center justify-center">
            <img src="/images/logo.webp" width={80} height={80} alt="Afrivas Logo" className="text-blue-600 rounded-md" />
          </a>
        </div>
        {children}
        <Toaster />
      </div>
    </div>
    // </ReduxProvider>
  )
}

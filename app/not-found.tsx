"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* 404 Animation */}
                <div className="relative">
                    <h1 className="text-[150px] md:text-[200px] font-bold text-gray-200 dark:text-gray-700 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Search className="w-16 h-16 md:w-24 md:h-24 text-primary-100 animate-pulse" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="w-full sm:w-auto gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <Link href="/" className="w-full sm:w-auto">
                        <Button className="w-full gap-2 bg-primary-100 hover:bg-primary-100/90 text-white">
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Here are some helpful links instead:
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <Link href="/" className="text-primary-100 hover:underline">
                            Home
                        </Link>
                        <Link href="/about" className="text-primary-100 hover:underline">
                            About
                        </Link>
                        <Link href="/contact" className="text-primary-100 hover:underline">
                            Contact
                        </Link>
                        <Link href="/login" className="text-primary-100 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

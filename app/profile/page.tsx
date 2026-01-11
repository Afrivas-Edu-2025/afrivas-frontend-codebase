"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { User, Mail, Shield, Building2, UserCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    const { user, token, logout, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !token) {
            router.push("/login")
        }
    }, [loading, token, router])

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-100"></div>
            </div>
        )
    }

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="h-32 bg-gradient-to-r from-primary-100 to-primary-100/60"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6 flex justify-between items-end">
                            <div className="p-2 bg-white dark:bg-gray-800 rounded-full">
                                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800">
                                    <UserCircle className="w-24 h-24 text-gray-400" />
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="mb-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {user.firstName ? `${user.firstName} ${user.lastName}` : user.universityName || user.username}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 capitalize">{user.role?.toLowerCase()} Account</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Mail className="w-5 h-5 text-primary-100" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-gray-400">Email Address</p>
                                            <p>{user.email || user.universityEmail}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <User className="w-5 h-5 text-primary-100" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-gray-400">Username</p>
                                            <p>@{user.username || user.adminUsername}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <Shield className="w-5 h-5 text-primary-100" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-gray-400">Role</p>
                                            <p className="font-medium text-primary-100">{user.role}</p>
                                        </div>
                                    </div>
                                    {(user.universityName || user.school?.schoolName) && (
                                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                            <Building2 className="w-5 h-5 text-primary-100" />
                                            <div>
                                                <p className="text-xs font-semibold uppercase text-gray-400">Institution</p>
                                                <p>{user.universityName || user.school?.schoolName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
                    <p className="text-amber-800 dark:text-amber-200 text-sm">
                        <strong>Note:</strong> Dashboards are currently disabled. You are viewing your profile page as the main landing area after login.
                    </p>
                </div>
            </div>
        </div>
    )
}

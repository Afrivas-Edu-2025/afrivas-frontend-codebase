"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, User, Mail, Shield, UserCheck } from "lucide-react"
import { Input } from "@/components/ui/input"

import CreateSuperAdminForm from "@/components/forms/CreateSuperAdminForm"
import { useGetSuperAdminsQuery } from "@/services/superAdminApi"

export default function SuperAdminsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { data, isLoading } = useGetSuperAdminsQuery()

    const admins = data?.data || []

    const filteredAdmins = admins.filter((admin: any) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Platform Administrators</h1>
                    <p className="text-muted-foreground">Manage platform-wide super administrators</p>
                </div>
                <CreateSuperAdminForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Search Admins</CardTitle>
                    <CardDescription>Filter administrator accounts by name, username or email</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, username or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center flex flex-col items-center gap-2">
                        <Shield className="h-8 w-8 text-blue-500 animate-pulse" />
                        <span>Loading administrators...</span>
                    </div>
                ) : filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin: any) => (
                        <Card key={admin.id} className="overflow-hidden border-t-4 border-t-blue-600">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                                        {admin.profilePictureUrl ? (
                                            <img src={admin.profilePictureUrl} alt={admin.name} className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <Shield size={24} />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                                            {admin.role}
                                        </div>
                                    </div>
                                </div>
                                <CardTitle className="mt-4 text-lg">{admin.name}</CardTitle>
                                <CardDescription className="font-mono text-xs">
                                    @{admin.username}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail size={14} />
                                    <span className="truncate">{admin.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <UserCheck size={14} />
                                    <span>Added {new Date(admin.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">Edit Account</Button>
                                <Button variant="ghost" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">Revoke</Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full py-12">
                        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Shield className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">No Administrators Found</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    There are no other super administrators in the system.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

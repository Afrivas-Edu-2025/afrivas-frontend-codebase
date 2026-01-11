"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Building2, MapPin, Mail, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"

import CreateUniversityForm from "@/components/forms/CreateUniversityForm"
import { useGetUniversitiesQuery } from "@/services/superAdminApi"

export default function UniversitiesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { data, isLoading } = useGetUniversitiesQuery()

    const universities = data?.data || []

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Universities</h1>
                    <p className="text-muted-foreground">Manage multi-tenant university environments</p>
                </div>
                <CreateUniversityForm />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Search & Filter</CardTitle>
                    <CardDescription>Find specific universities by name, email or location</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search universities..."
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
                    <div className="col-span-full py-12 text-center">Loading universities...</div>
                ) : universities.length > 0 ? (
                    universities.map((uni: any) => (
                        <Card key={uni.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 dark:bg-gray-800/50 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        {uni.universityLogoUrl ? (
                                            <img src={uni.universityLogoUrl} alt={uni.universityName} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <Building2 size={24} />
                                        )}
                                    </div>
                                    <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">
                                        Active
                                    </div>
                                </div>
                                <CardTitle className="mt-4 text-lg">{uni.universityName}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin size={12} /> {uni.city}, {uni.country}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Mail size={14} />
                                    <span>{uni.universityEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar size={14} />
                                    <span>Joined {new Date(uni.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                                <Button variant="outline" size="sm" className="flex-1">Manage Admins</Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full py-12">
                        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <Building2 className="h-8 w-8 text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">No Universities Found</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Get started by creating your first university tenant environment.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

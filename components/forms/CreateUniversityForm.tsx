"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Building2, User, Mail, Lock, Globe, MapPin, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCreateUniversityMutation } from "@/services/superAdminApi"

const formSchema = z.object({
    universityName: z.string().min(5, "University name must be at least 5 characters"),
    universityEmail: z.string().email("Invalid email address"),
    universityLogoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    adminName: z.string().min(2, "Admin name must be at least 2 characters"),
    adminEmail: z.string().email("Invalid admin email"),
    adminPassword: z.string().min(6, "Password must be at least 6 characters"),
})

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

export default function CreateUniversityForm() {
    const [open, setOpen] = useState(false)
    const [createUniversity, { isLoading }] = useCreateUniversityMutation()
    const [validationError, setValidationError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            universityName: "",
            universityEmail: "",
            universityLogoUrl: "",
            address: "",
            city: "",
            adminName: "",
            adminEmail: "",
            adminPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setValidationError(null)
        setSuccessMessage(null)
        try {
            await createUniversity(values).unwrap()
            setSuccessMessage("University and Admin created successfully!")
            toast.success("University and Admin created successfully")

            // Optional: reset form after a short delay or immediately
            setTimeout(() => {
                setOpen(false)
                form.reset()
                setSuccessMessage(null)
            }, 2000)

        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to create university"
            console.error("Failed to create university:", error)
            setValidationError(errorMessage)
        }
    }

    const onOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            setValidationError(null)
            setSuccessMessage(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add University
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New University</DialogTitle>
                    <DialogDescription>
                        Create a new university tenant and its primary administrator account.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Error Alert */}
                        {validationError && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>
                                    {validationError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Success Alert */}
                        {successMessage && (
                            <Alert className="border-green-500 text-green-600 bg-green-50 dark:bg-green-900/10">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>
                                    {successMessage}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                                    <Building2 className="h-4 w-4" /> University Details
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="universityName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>University Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Afrivas Institute of Tech" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="universityEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Official Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="info@university.edu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="universityLogoUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>University Logo URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/logo.png" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Street Address</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123 University Drive" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Freetown" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold flex items-center gap-2 border-b pb-2">
                                    <User className="h-4 w-4" /> Admin Account
                                </h3>
                                <FormField
                                    control={form.control}
                                    name="adminName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Primary Administrator" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="adminEmail"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Admin Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="admin@university.edu" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="adminPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Initial Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Min. 6 characters</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                                    </>
                                ) : (
                                    "Create University"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

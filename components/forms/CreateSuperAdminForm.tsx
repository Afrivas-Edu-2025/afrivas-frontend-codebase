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
import { Plus, User, Mail, Lock, Loader2, Shield, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { useCreateSuperAdminMutation } from "@/services/superAdminApi"
import { Alert, AlertDescription } from "@/components/ui/alert"

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(4, "Username must be at least 4 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    profilePictureUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
})

export default function CreateSuperAdminForm() {
    const [open, setOpen] = useState(false)
    const [createSuperAdmin, { isLoading }] = useCreateSuperAdminMutation()
    const [validationError, setValidationError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
            profilePictureUrl: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setValidationError(null)
        setSuccessMessage(null)
        try {
            await createSuperAdmin(values).unwrap()
            setSuccessMessage("Super Admin created successfully!")
            toast.success("Super Admin created successfully")

            setTimeout(() => {
                setOpen(false)
                form.reset()
                setSuccessMessage(null)
            }, 2000)
        } catch (error: any) {
            const errorMessage = error?.data?.message || "Failed to create Super Admin"
            console.error("Failed to create Super Admin:", error)
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
                    <Plus className="mr-2 h-4 w-4" /> Add Super Admin
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Add New Super Admin
                    </DialogTitle>
                    <DialogDescription>
                        Create a new platform-wide administrator with full system access.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {validationError && (
                            <Alert variant="destructive">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>{validationError}</AlertDescription>
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert className="border-green-500 text-green-600 bg-green-50 dark:bg-green-900/10">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>{successMessage}</AlertDescription>
                            </Alert>
                        )}

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="johndoe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@afrivas.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profilePictureUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile Picture URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/photo.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                    "Create Super Admin"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

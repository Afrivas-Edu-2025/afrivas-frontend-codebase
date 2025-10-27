import { AuthForm } from "@/components/ui/auth-form"

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthForm type="login" userType="admin" />
    </div>
  )
}

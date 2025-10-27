import { AuthForm } from "@/components/ui/auth-form"

export default function TeacherLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <AuthForm type="login" userType="teacher" />
    </div>
  )
}

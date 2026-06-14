"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useResetPasswordMutation } from "@/services/authServices";

type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

const ROLES: { value: Role; label: string }[] = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'LECTURER', label: 'Lecturer' },
  { value: 'ADMIN', label: 'Admin' },
];

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('STUDENT');
  const [done, setDone] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!code) {
      toast({ variant: "destructive", title: "Invalid link", description: "No reset code found. Please request a new link." });
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (newPassword.length < 8) {
      toast({ variant: "destructive", title: "Weak password", description: "Password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Mismatch", description: "Passwords do not match." });
      return;
    }

    try {
      await resetPassword({ code, password: newPassword, role }).unwrap();
      setDone(true);
    } catch (err: any) {
      const message = err?.data?.message || "Reset failed. The code may have expired.";
      toast({ variant: "destructive", title: "Error", description: message });
    }
  };

  if (!code) {
    return (
      <div className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Invalid reset link</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">This link is missing a reset code. Please request a new password reset.</p>
        <Button className="w-full" onClick={() => router.push("/forgot-password")}>Request new link</Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Password updated!</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Your password has been changed. You can now log in with your new password.</p>
        <Button className="w-full bg-secondary-100 hover:bg-secondary-100/90 text-white" onClick={() => router.push("/login")}>
          Go to login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary-100 dark:text-primary-100 mb-2">Set new password</h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account type</label>
          <div className="flex gap-2 mt-1.5">
            {ROLES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  role === value
                    ? 'bg-secondary-100 text-white border-secondary-100 dark:bg-lemon-100 dark:text-secondary-100 dark:border-lemon-100'
                    : 'bg-white dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-secondary-100 dark:hover:border-lemon-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <div className="relative mt-1.5">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 pr-10"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1.5 h-11"
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-secondary-100 hover:bg-secondary-100/90 dark:bg-lemon-100 dark:hover:bg-lemon-200 text-white dark:text-secondary-100 font-medium"
          disabled={isLoading || !newPassword || !confirmPassword}
        >
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-md mx-auto px-4">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-primary-100/30 border-t-primary-100 rounded-full animate-spin" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}

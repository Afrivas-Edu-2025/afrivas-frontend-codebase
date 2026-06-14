"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, KeyRound, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useForgotPasswordMutation } from "@/services/authServices";

type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

const ROLES: { value: Role; label: string }[] = [
  { value: 'STUDENT', label: 'Student' },
  { value: 'LECTURER', label: 'Lecturer' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<Role>('STUDENT');
  const [submitted, setSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      await forgotPassword({ username: username.trim(), role }).unwrap();
      setSubmitted(true);
    } catch (err: any) {
      const message = err?.data?.message || "Something went wrong. Please try again.";
      toast({ variant: "destructive", title: "Error", description: message });
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full max-w-md mx-auto px-4">
        <div className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Request sent</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            If <strong>{username}</strong> is registered as a <strong>{role.toLowerCase()}</strong>, a reset code has been sent to the associated email address. The code expires in <strong>15 minutes</strong>.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            Once you receive the code, go to the reset password page and enter it along with your new password.
          </p>
          <div className="flex flex-col gap-2 mt-2">
            <Button
              className="w-full bg-secondary-100 hover:bg-secondary-100/90 dark:bg-lemon-100 dark:hover:bg-lemon-200 text-white dark:text-secondary-100"
              onClick={() => router.push("/reset-password")}
            >
              Enter reset code
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full max-w-md mx-auto px-4">
      <div className="w-full bg-white dark:bg-gray-800/95 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary-100/10 dark:bg-primary-100/20 rounded-full flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-primary-100" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary-100 dark:text-primary-100 mb-2">Forgot password?</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Enter your username and we'll send a reset code to your registered email.
          </p>
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
            <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1.5 h-11"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-secondary-100 hover:bg-secondary-100/90 dark:bg-lemon-100 dark:hover:bg-lemon-200 text-white dark:text-secondary-100 font-medium"
            disabled={isLoading || !username.trim()}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
            ) : (
              "Send reset code"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
        </form>
      </div>
    </div>
  );
}

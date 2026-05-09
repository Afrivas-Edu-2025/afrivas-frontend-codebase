"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useForgotPasswordMutation } from "@/services/authServices";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await forgotPassword({ email }).unwrap();
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Check your email</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            If <strong>{email}</strong> is registered, you'll receive a password reset link
            within a few minutes. The link expires in <strong>15 minutes</strong>.
          </p>
          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={() => router.push("/login")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
          </Button>
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
              <Mail className="w-6 h-6 text-primary-100" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary-100 dark:text-primary-100 mb-2">Forgot password?</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@afrivas.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 h-11"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-secondary-100 hover:bg-secondary-100/90 dark:bg-lemon-100 dark:hover:bg-lemon-200 text-white dark:text-secondary-100 font-medium"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending...</>
            ) : (
              "Send reset link"
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

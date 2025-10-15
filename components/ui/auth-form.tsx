"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, CheckCircle, Users, Shield, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useLoginUserMutation } from "@/services/authServices";
import { useAuth } from "@/components/auth-context";

export function AuthForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loginUser, { isLoading, error }] = useLoginUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side validation
    const errors: string[] = [];
    const newFieldErrors: Record<string, string> = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Valid email is required");
      newFieldErrors.email = "Valid email is required";
    }
    if (!formData.password) {
      errors.push("Password is required");
      newFieldErrors.password = "Password is required";
    }

    if (errors.length > 0) {
      setFieldErrors(newFieldErrors);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: errors.join(", "),
      });
      return;
    }

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      console.log("Sending loginData:", JSON.stringify(loginData, null, 2));

      const result = await loginUser(loginData).unwrap();
      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      // Store user and token in AuthContext and localStorage
      login(result.data.user, result.data.tokens.accessToken);

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });

      // Redirect based on user role
      const dashboardRoute =
        result.data.user.role === "student"
          ? "/student/dashboard"
          : result.data.user.role === "lecturer"
          ? "/lecturer/dashboard"
          : "/admin/dashboard";
      setTimeout(() => router.push(dashboardRoute), 2000);
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err?.data?.message || err.message || "An unexpected error occurred.";
      const errorDetails = err?.data?.errors
        ? err.data.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(", ")
        : "";
      setFieldErrors(
        err?.data?.errors
          ? err.data.errors.reduce((acc: Record<string, string>, e: { field: string; message: string }) => {
              acc[e.field] = e.message;
              return acc;
            }, {})
          : {}
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: errorDetails ? `${errorMessage} (${errorDetails})` : errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-600/50 rounded-lg flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-100 p-12 flex-col justify-between rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Afrivas</span>
          </div>
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Welcome Back to Afrivas</h1>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Easy Course Management</h3>
                  <p className="text-gray-600 text-sm">Streamline your academic journey with our intuitive course management system.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Connect with Peers</h3>
                  <p className="text-gray-600 text-sm">Build meaningful connections with students and faculty across departments.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                  <p className="text-gray-600 text-sm">Your academic data is protected with enterprise-grade security measures.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-500">© 2025 Afrivas • Privacy & Terms</div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 dark:bg-gray-800/95 rounded-xl shadow-lg border border-border-gray-200 dark:border-border-gray-400">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign in to Afrivas</h2>
            <p className="text-gray-600 dark:text-gray-300">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@afrivas.edu"
                value={formData.email}
                onChange={handleChange}
                className="mt-1.5 h-11 bg-background-gray-50 dark:bg-gray-900/50 border-border-gray-200 dark:border-gray-700 focus:border-gray-600 dark:focus:border-emerald-500"
              />
              {fieldErrors.email && <span className="text-red-600 text-sm mt-1">{fieldErrors.email}</span>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative mt-2">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1.5 h-11 bg-background-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:border-gray-700 dark:focus:border-emerald-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 top-1 flex items-center text-muted-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <span className="text-red-600 text-sm mt-1">{fieldErrors.password}</span>}
              <div className="text-right mt-2">
                <a href="/auth/reset-password" className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-all duration-200"
              disabled={isLoading || !formData.email || !formData.password}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <div className="text-center mt-4 text-sm text-red-600">
                {((error as any).data as { message?: string })?.message || "An error occurred during login."}
              </div>
            )}

            {/* Signup Link */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Don't have an account? </span>
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import type React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChefHat, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const LoginSchema = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email addresss"),
    password: z.string().min(1, "Password is required"),
  });

  type ILoginSchema = z.infer<typeof LoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (values: ILoginSchema) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <ChefHat className="h-10 w-10 text-orange-500" />
            <span className="text-3xl font-bold text-gray-800">
              RecipeShare
            </span>
          </Link>
          <p className="text-gray-600 mt-2">
            Welcome back to our cooking community
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm py-6">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">
                  {error === "Invalid password" &&
                    "Invalid password. Please try again."}
                  {error === "No user found with this email" &&
                    "No account found with this email."}
                  {error === "Email and password required" &&
                    "Please enter both email and password."}
                  {error === "User is not verified !" &&
                    "User is not verified !"}
                </span>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("email")}
                    placeholder="Enter your email"
                    className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Label>
                  {errors?.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </Label>{" "}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <Label>
                  {errors?.password && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </Label>{" "}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="cursor-pointer border-gray-200 hover:bg-gray-50"
                onClick={() => signIn("github", { callbackUrl: "/" })}
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                GitHub
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-orange-600 hover:text-orange-700">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-orange-600 hover:text-orange-700"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

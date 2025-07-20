"use client";

import type React from "react";

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
import {
  ChefHat,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ReceiptIndianRupeeIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendMail } from "@/lib/sendMail";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const UserSchema = z
    .object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email address"),

      password: z
        .string()
        .min(1, "Password is required")
        .min(8, "Password is too short")
        .max(20, "Password is too long"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
      agreementAccepted: z.boolean().refine((val) => val === true, {
        message: "Please accept the terms and conditions",
      }),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    });

  type IUserSchema = z.infer<typeof UserSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserSchema>({ resolver: zodResolver(UserSchema) });
  const onSubmit = async (values: IUserSchema) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/signupUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          toast.warning("Warning", {
            description: "The user is already exists !",
          });
          return;
        }
        toast.error("Error Occured !", {
          description: "Error occurred during signup !",
        });
        // throw new Error(responseData.message || "Something went wrong");
        return;
      }

      const email = responseData?.data?.email;

      const name =
        responseData?.data?.firstName + " " + responseData?.data?.lastName;
      const res = await sendMail({ sendTo: email, name: name, usage: "login" });

      const otp = res?.otp;

      const userId = responseData?.data?.userId;

      if (res?.status === 200) {
        const insertOtpResponse = await fetch("/api/insertOtp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, userId }),
        });

        const insertOtpData = await insertOtpResponse.json();
        if (insertOtpResponse.ok) {
          router.push(`/auth/verify?email=${email}`);
        } else {
          toast.error("Error Occurred !", {
            description: "Failed to insert otp record !",
          });
        }
      } else {
        toast.error("Error Occurred !", {
          description: "Failed to send otp on registered email",
        });
      }
    } catch (error) {
      console.error("Detailed error:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
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
          <p className="text-gray-600 mt-2">Join our cooking community today</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm py-6">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-600">
              Start sharing your favorite recipes with the world
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...register("firstName")}
                      type="text"
                      placeholder="John"
                      className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                  <Label>
                    {errors.firstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register("lastName")}
                    type="text"
                    placeholder="Doe"
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Label>
                    {errors.lastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Label>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Label>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </Label>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Label>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex-1  items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register("agreementAccepted")}
                  className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />

                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Privacy Policy <span className="text-red-500">*</span>
                  </Link>
                </label>
                <Label>
                  {errors.agreementAccepted && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.agreementAccepted.message}
                    </p>
                  )}
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
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
            {/* 
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 cursor-pointer"
              >
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
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
            </div> */}

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

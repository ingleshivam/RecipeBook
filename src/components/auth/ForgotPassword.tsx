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
import {
  ChefHat,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendMail } from "@/lib/sendMail";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/getUserDetails?email=${email}`);
      const data = await response.json();
      if (!data?.response) {
        toast.error("Error", {
          description: data?.message,
        });
        return;
      } else {
        const fullName =
          data?.response?.firstName + " " + data?.response?.lastName;
        const res = await sendMail({
          sendTo: email,
          name: fullName,
          usage: "change_password",
        });
        const otp = res?.otp;
        const userId = data?.response?.userId;
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
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setIsEmailSent(true);
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
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsEmailSent(true);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.push("/auth/signin");
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Show success message or update UI as needed
    } catch (error) {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state - email sent
  if (isEmailSent) {
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
          </div>

          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm py-4">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Check Your Email
              </h2>

              <div className="space-y-4 mb-8">
                <p className="text-gray-600 leading-relaxed">
                  We've sent password reset instructions to:
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                  <p className="font-medium text-orange-700">{email}</p>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Click the link in the email to reset your password. The link
                  will expire in 10 minutes for security.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleBackToSignIn}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Back to Sign In
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">
                      Didn't receive the email?
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="w-full border-gray-200 hover:bg-gray-50 bg-transparent"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Resend Email</span>
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Make sure to check your spam folder. If you still don't
                    receive the email, contact our support team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-sm text-gray-500">Need help?</p>
            <Link
              href="/support"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main forgot password form
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
          <p className="text-gray-600 mt-2">Reset your password</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm py-4">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-gray-600 px-2 leading-relaxed">
              No worries! Enter your email address and we'll send you
              instructions to reset your password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(""); // Clear error when user starts typing
                    }}
                    className={`pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Send OTP</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Additional Information */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-800">
                    What happens next?
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• You'll receive an otp on email</li>
                    <li>• The otp will expires in 10 minutes for security</li>
                    <li>• Ente the otp to create a new password</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back to Sign In */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>

            {/* Alternative Options */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">Don't have an account?</p>
                <Link
                  href="/auth/signup"
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Create a new account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center mt-6 text-xs text-gray-500 space-y-1">
          <p>🔒 Your security is important to us</p>
          <p>Reset links expire quickly and can only be used once</p>
        </div>
      </div>
    </div>
  );
}

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
import {
  ChefHat,
  Mail,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const [errorOccurred, isErrorOccurred] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "your email";

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);
    setError("");

    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await fetch(`/api/insertOtp?email=${email}`, {
        method: "GET",
      });

      const otpRecord = await response.json();
      const record = otpRecord?.data;

      // Check for expiration
      const now = new Date();
      const expiration = new Date(record?.expirationTimestamp);

      if (now > expiration) {
        setError("OTP is expired. Please request a new one.");
        return;
      }

      // Check for match
      if (otpString === record?.otp) {
        const otp = record?.otp;
        const response = await fetch("/api/insertOtp", {
          method: "PUT",
          body: JSON.stringify({ otp, email }),
        });

        if (response.ok) {
          router.push("/");
        }
      } else {
        setError("Invalid OTP. Please check your email and try again.");
      }
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // setTimeLeft(600);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      setError("");
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6 && !isLoading) {
      handleVerifyOtp(new Event("submit") as any);
    }
  }, [otp]);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-4">
                Your email has been successfully verified. You're being
                redirected to your account.
              </p>
              <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm py-6">
          <CardHeader className="space-y-1 text-center pb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>

            <CardTitle className="text-2xl font-bold text-gray-800">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-600 px-2">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-gray-800">{email}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* OTP Input Fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block text-center">
                  Enter verification code
                </label>
                <div
                  className="flex justify-center space-x-2"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-orange-500 focus:ring-orange-500 ${
                        error ? "border-red-300" : "border-gray-200"
                      } ${digit ? "border-orange-300 bg-orange-50" : ""}`}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Timer */}
              <div className="text-center">
                {errorOccurred ? (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium text-orange-600">
                      TOKEN EXPIRED
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Code expires in{" "}
                    <span className="font-medium text-orange-600">
                      10 mins.
                    </span>
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                disabled={isLoading || otp.join("").length !== 6}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>

            {/* Resend Section */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Didn't receive the code?
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={!canResend || isResending}
                  className="w-full border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  {isResending ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Resend Code</span>
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500">
                  Make sure to check your spam folder if you don't see the email
                </p>
              </div>
            </div>

            {/* Back Link */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-6 text-xs text-gray-500 space-y-1">
          <p>Having trouble? Contact our support team</p>
          <p>
            <Link
              href="/support"
              className="text-orange-600 hover:text-orange-700"
            >
              Get Help
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

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
import { Progress } from "@/components/ui/progress";
import {
  ChefHat,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Shield,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
  label: string;
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: "bg-gray-200",
    label: "Enter a password",
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if this is a password reset (has token) or regular change password
  const resetToken = searchParams.get("token");
  const isPasswordReset = !!resetToken;

  const email = searchParams.get("email");
  const isEmail = !!email;

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return {
        score: 0,
        feedback: [],
        color: "bg-gray-200",
        label: "Enter a password",
      };
    }

    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    // Determine strength
    let color = "bg-red-500";
    let label = "Very Weak";

    if (score >= 5) {
      color = "bg-green-500";
      label = "Very Strong";
    } else if (score >= 4) {
      color = "bg-blue-500";
      label = "Strong";
    } else if (score >= 3) {
      color = "bg-yellow-500";
      label = "Good";
    } else if (score >= 2) {
      color = "bg-orange-500";
      label = "Fair";
    }

    return { score, feedback, color, label };
  };

  // Update password strength when new password changes
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(newPassword));
  }, [newPassword]);

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Current password validation (only for regular change, not reset)
    if (!isPasswordReset && !currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    // New password validation
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordStrength.score < 3) {
      newErrors.newPassword = "Password is too weak";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Check if new password is same as current (for regular change)
    if (
      !isPasswordReset &&
      currentPassword &&
      newPassword &&
      currentPassword === newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const decryptData = await fetch(
        `/api/encdecData?decryptMessage=${resetToken}`
      );

      const data = await decryptData.json();

      if (!decryptData.ok) {
        toast.error("Error", { description: data?.message });
        return;
      }

      const getOtpDataByEmail = await fetch(`/api/insertOtp?email=${email}`, {
        method: "GET",
      });

      const otpRecord = await getOtpDataByEmail.json();
      const record = otpRecord?.data;

      const now = new Date();
      const expiration = new Date(record?.expirationTimestamp);

      if (now > expiration) {
        setErrors({ response: "OTP is expired. Please request a new one." });
        return;
      }

      if (
        parseInt(data?.data?.decryptedMessage?.msg) === parseInt(record?.otp)
      ) {
        const otp = record?.otp;
        const response = await fetch("/api/insertOtp", {
          method: "PUT",
          body: JSON.stringify({ otp, email }),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error("Error", {
            description: data?.message,
          });
          return;
        }

        const updateUser = await fetch("/api/signupUser", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, newPassword }),
        });

        setIsSuccess(true);

        setTimeout(() => {
          if (isPasswordReset) {
            router.push("/auth/signin");
          }
        }, 3000);
      } else {
        setErrors({
          response: "Invalid OTP. Please check your email and try again.",
        });
      }
    } catch (error) {
      setErrors({
        general: isPasswordReset
          ? "Failed to reset password. The link may have expired."
          : "Failed to change password. Please check your current password and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isPasswordReset
                  ? "Password Reset Successfully!"
                  : "Password Changed Successfully!"}
              </h2>
              <p className="text-gray-600 mb-4">
                {isPasswordReset
                  ? "Your password has been reset. You can now sign in with your new password."
                  : "Your password has been updated successfully. Your account is now more secure."}
              </p>
              <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
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
          <p className="text-gray-600 mt-2">
            {isPasswordReset
              ? "Create your new password"
              : "Update your password"}
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm py-4">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isPasswordReset ? "Reset Your Password" : "Change Password"}
            </CardTitle>
            <CardDescription className="text-gray-600 px-2">
              {isPasswordReset
                ? "Enter your new password below. Make sure it's strong and secure."
                : "Enter your current password and choose a new secure password."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password - Only show for regular password change */}
              {!isPasswordReset && (
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-gray-700 font-medium"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (errors.currentPassword) {
                          setErrors((prev) => ({
                            ...prev,
                            currentPassword: "",
                          }));
                        }
                      }}
                      className={`pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                        errors.currentPassword
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{errors.currentPassword}</span>
                    </div>
                  )}
                </div>
              )}

              {/* New Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className="text-gray-700 font-medium"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (errors.newPassword) {
                        setErrors((prev) => ({ ...prev, newPassword: "" }));
                      }
                    }}
                    className={`pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                      errors.newPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Password strength:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          passwordStrength.score >= 4
                            ? "text-green-600"
                            : passwordStrength.score >= 3
                            ? "text-blue-600"
                            : passwordStrength.score >= 2
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <Progress
                      value={(passwordStrength.score / 5) * 100}
                      className="h-2"
                    />

                    {/* Password Requirements */}
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {[
                        {
                          check: newPassword.length >= 8,
                          text: "At least 8 characters",
                        },
                        {
                          check: /[A-Z]/.test(newPassword),
                          text: "One uppercase letter",
                        },
                        {
                          check: /[a-z]/.test(newPassword),
                          text: "One lowercase letter",
                        },
                        { check: /\d/.test(newPassword), text: "One number" },
                        {
                          check: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
                          text: "One special character",
                        },
                      ].map((req, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 ${
                            req.check ? "text-green-600" : "text-gray-500"
                          }`}
                        >
                          {req.check ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          <span>{req.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.newPassword && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{errors.newPassword}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-gray-700 font-medium"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }
                    }}
                    className={`pl-10 pr-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500 ${
                      errors.confirmPassword
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
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

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div
                    className={`flex items-center space-x-2 text-sm ${
                      newPassword === confirmPassword
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {newPassword === confirmPassword ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    <span>
                      {newPassword === confirmPassword
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </span>
                  </div>
                )}

                {errors.confirmPassword && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                disabled={isLoading || passwordStrength.score < 3}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>
                      {isPasswordReset
                        ? "Resetting Password..."
                        : "Changing Password..."}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>
                      {isPasswordReset ? "Reset Password" : "Change Password"}
                    </span>
                  </div>
                )}
              </Button>
            </form>
            {errors.response && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{errors.response}</span>
              </div>
            )}

            {/* Security Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-800">
                    Security Tips
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Use a unique password you don't use elsewhere</li>
                    <li>• Consider using a password manager</li>
                    <li>• Don't share your password with anyone</li>
                    <li>• Change your password regularly</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <Link
                href={isPasswordReset ? "/auth/signin" : "/profile"}
                className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isPasswordReset ? "Back to Sign In" : "Back to Profile"}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center mt-6 text-xs text-gray-500 space-y-1">
          <p>🔒 Your password is encrypted and secure</p>
          <p>We never store your password in plain text</p>
        </div>
      </div>
    </div>
  );
}

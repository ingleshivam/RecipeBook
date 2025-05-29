"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6">
          {error === "Configuration"
            ? "There is a problem with the server configuration."
            : error === "AccessDenied"
            ? "You do not have permission to sign in."
            : "An error occurred during authentication."}
        </p>
        <Button asChild>
          <Link href="/auth/signin">Return to Sign In</Link>
        </Button>
      </div>
    </div>
  );
}

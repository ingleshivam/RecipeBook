import SignIn from "@/components/auth/SignIn";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <span className="loader"></span>
        </div>
      }
    >
      <SignIn />
    </Suspense>
  );
}

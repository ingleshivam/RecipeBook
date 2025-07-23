import Verify from "@/components/auth/Verify";
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
      <Verify />;
    </Suspense>
  );
}

import Verify from "@/components/auth/Verify";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={"Loading..."}>
      <Verify />;
    </Suspense>
  );
}

import SignIn from "@/components/auth/SignIn";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={"Loading..."}>
      <SignIn />
    </Suspense>
  );
}

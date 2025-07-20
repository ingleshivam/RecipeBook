import ChangePassword from "@/components/auth/ChangePassword";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={"Loading.."}>
      <ChangePassword />
    </Suspense>
  );
}

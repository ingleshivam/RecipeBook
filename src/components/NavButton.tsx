"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const NavButton = ({ buttonName }: { buttonName: string }) => {
  const router = useRouter();
  const ButtonsInfo = {
    SignIn: {
      buttonName: "Sign In",
      style:
        "border-orange-200 text-orange-600 hover:bg-orange-50 cursor-pointer",
      varient: "outline" as const,
      redirectTo: "/auth/signin",
    },
    SignUp: {
      buttonName: "Join Now",
      style: "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer",
      varient: "default" as const,
      redirectTo: "/auth/signup",
    },
  };
  return (
    <>
      <Button
        variant={
          buttonName == "SignIn"
            ? ButtonsInfo.SignIn.varient
            : ButtonsInfo.SignUp.varient
        }
        className={
          buttonName === "SignIn"
            ? ButtonsInfo.SignIn.style
            : ButtonsInfo.SignUp.style
        }
        onClick={
          buttonName === "SignIn"
            ? () => router.push(ButtonsInfo.SignIn.redirectTo)
            : () => router.push(ButtonsInfo.SignUp.redirectTo)
        }
      >
        {buttonName === "SignIn"
          ? ButtonsInfo.SignIn.buttonName
          : ButtonsInfo.SignUp.buttonName}
      </Button>
    </>
  );
};
export default NavButton;

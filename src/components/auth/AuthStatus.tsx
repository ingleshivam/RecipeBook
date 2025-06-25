"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import NavButton from "../NavButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "../LoadingSpinner";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
export function AuthStatus() {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center jusitfy-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        <NavButton buttonName="SignIn" />
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer border-none p-0 outline-none bg-transparent"
          >
            <Avatar className="w-9 h-9 ">
              <AvatarImage
                src={session?.user?.image || "https://github.com/shadcn.png"}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 mt-4 rounded-xl shadow-lg bg-white/95 backdrop-blur border border-slate-200">
          <div className="flex flex-col items-center py-4 px-2">
            <span className="font-semibold text-lg">
              {session?.user?.name || "User"}
            </span>
            <span className="text-xs text-slate-500">
              {session?.user?.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push("/favourite-recipe")}
          >
            <span>
              <Heart />
            </span>
            <span>Favourite</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <svg
                className="w-4 h-4 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                />
              </svg>
              <span className="text-red-600 font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

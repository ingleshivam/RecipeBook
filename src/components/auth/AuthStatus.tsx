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
export function AuthStatus() {
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
            {session?.user?.image ? (
              <Avatar>
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar>
                <AvatarImage
                  src={"https://github.com/shadcn.png"}
                  alt={"User"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mt-4">
          <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
          <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Button
                variant="link"
                className="border-none w-full cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

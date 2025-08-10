"use client";
import {
  Bookmark,
  CirclePlus,
  Heart,
  House,
  MessageSquareText,
  Search,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NavButton from "./NavButton";

const NavIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className={`flex items-center justify-center`}>{children}</div>
);

export default function MobileMenu() {
  const path = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const isHome = path === "/";
  const isOnAllRecipe = path === "/recipe";
  const isOnSingleRecipe = path.startsWith("/recipe");
  const isOnFavouriteRecipe = path === "/favourite-recipe";
  const isOnAskAI = path === "/ai";

  return (
    <div className="grid grid-cols-5 h-full border-t-1 border-slate-300 shadow-xl/30">
      <NavIconWrapper>
        <House
          className="w-7 h-7"
          color={isHome ? "#EE4D28" : "#000"}
          onClick={() => router.push("/")}
        />
      </NavIconWrapper>
      <NavIconWrapper>
        <Search
          className="w-7 h-7"
          color={isOnAllRecipe || isOnSingleRecipe ? "#EE4D28" : "#000"}
          onClick={() => router.push("/recipe")}
        />
      </NavIconWrapper>
      <NavIconWrapper>
        <CirclePlus
          className="w-15 h-15"
          strokeWidth={1.5}
          color="white"
          fill="#EE4D28"
          onClick={() => router.push("/share-recipe")}
        />
      </NavIconWrapper>

      <NavIconWrapper>
        <MessageSquareText
          className="w-7 h-7"
          color={isOnAskAI ? "#EE4D28" : "#000"}
          onClick={() => router.push("/ai")}
        />
      </NavIconWrapper>
      <Sheet>
        <NavIconWrapper>
          <SheetTrigger asChild>
            <User className="w-7 h-7" />
          </SheetTrigger>
        </NavIconWrapper>
        <SheetContent className="!w-full">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Link href={"/favourite-recipe"}>
                <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Favourite Recipes</span>
                </div>
              </Link>
            </div>
            <div className="grid gap-3">
              {status === "unauthenticated" ? (
                <div className="flex justify-center">
                  <NavButton buttonName="SignIn" />
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              )}
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="outline-orange-500 border border-orange-500"
              >
                Close
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

"use client";
import {
  Bookmark,
  CirclePlus,
  Heart,
  House,
  MessageSquareText,
  Search,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const NavIconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className={`flex items-center justify-center`}>{children}</div>
);

export default function MobileMenu() {
  const path = usePathname();
  const router = useRouter();
  const isHome = path === "/";
  const isOnAllRecipe = path === "/recipe";
  const isOnSingleRecipe = path.startsWith("/recipe");
  const isOnFavouriteRecipe = path === "/favourite-recipe";
  return (
    // <div className="fixed bottom-0 bg-red-500 h-auto border-t-1 border-slate-500 shadow-xl/30  row-span-1  w-full">
    <div className="grid grid-cols-5 h-full border-t-1 border-slate-500 shadow-xl/30">
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
        <Heart
          className="w-7 h-7"
          color={isOnFavouriteRecipe ? "#EE4D28" : "#000"}
          onClick={() => router.push("/favourite-recipe")}
        />
      </NavIconWrapper>
      <NavIconWrapper>
        <MessageSquareText className="w-7 h-7" />
      </NavIconWrapper>
    </div>
    // </div>
  );
}

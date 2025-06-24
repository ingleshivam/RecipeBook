"use client";
import { ChefHat, Heart, Save, Share2 } from "lucide-react";
import Link from "next/link";
import { AuthStatus } from "./auth/AuthStatus";
import NavButton from "./NavButton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50  md:px-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={"/"}>
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="md:text-2xl font-bold text-gray-800">
                RecipeShare
              </span>
            </div>
          </Link>
          {pathname === "/" && <MainNavBar />}
          {pathname === "/recipe" && <AllRecipeNavBar />}
          {pathname.startsWith("/recipe/") && <ViewRecipeNavBar />}
          {pathname === "/share-recipe" && <ShareRecipeNavBar />}
          {pathname === "/admin" && <AdminNavbar />}
        </div>
      </header>
    </>
  );
}

const AllRecipeNavBar = () => {
  const { status } = useSession();
  const pathname = usePathname();
  return (
    <>
      <nav className="flex md:flex items-center space-x-8">
        <Link
          href="#about"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          Share Recipe
        </Link>
        <div className=" flex gap-5">
          <AuthStatus />
          {status === "unauthenticated" && <NavButton buttonName="SignUp" />}
        </div>
      </nav>
    </>
  );
};

const MainNavBar = () => {
  const { data, status } = useSession();
  return (
    <>
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="#recipes"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          Recipes
        </Link>
        <Link
          href="#how-it-works"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          How It Works
        </Link>

        <Link
          href="#about"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          About
        </Link>

        {(data && (data.user as any))?.role === "A" && (
          <Link
            href="/admin"
            className="text-gray-600 hover:text-orange-500 transition-colors"
          >
            Dashboard
          </Link>
        )}
        <div className=" flex gap-5">
          <AuthStatus />
          {status === "unauthenticated" && <NavButton buttonName="SignUp" />}
        </div>
      </nav>
    </>
  );
};

const ViewRecipeNavBar = () => {
  const { status } = useSession();
  return (
    <>
      <nav className="flex md:flex items-center space-x-8">
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="sm"
                disabled={status === "unauthenticated"}
              >
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className={clsx(status === "authenticated" && "hidden")}
          >
            <p>Login to save recipe</p>
          </TooltipContent>
        </Tooltip> */}

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="sm"
                disabled={status === "unauthenticated"}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className={clsx(status === "authenticated" && "hidden")}
          >
            <p>Login to share recipe</p>
          </TooltipContent>
        </Tooltip>

        <div className=" flex gap-5">
          <AuthStatus />
          {status === "unauthenticated" && <NavButton buttonName="SignUp" />}
        </div>
      </nav>
    </>
  );
};

const ShareRecipeNavBar = () => {
  const { status } = useSession();
  return (
    <>
      <nav className="hidden md:flex items-center space-x-8">
        <Button variant="ghost" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <div className=" flex gap-5">
          <AuthStatus />
          {status === "unauthenticated" && <NavButton buttonName="SignUp" />}
        </div>
      </nav>
    </>
  );
};

const AdminNavbar = () => {
  const { status } = useSession();
  return (
    <>
      <nav className=" md:flex items-center space-x-8">
        <div className=" flex gap-5">
          <AuthStatus />
          {status === "unauthenticated" && <NavButton buttonName="SignUp" />}
        </div>
      </nav>
    </>
  );
};

"use client";
import { ChefHat, Heart, Save, Share2 } from "lucide-react";
import Link from "next/link";
import { AuthStatus } from "./auth/AuthStatus";
import NavButton from "./NavButton";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export default function Navbar() {
  const pathname = usePathname();
  console.log("pathname ; ", pathname);
  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 px-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-800">
              RecipeShare
            </span>
          </div>
          {pathname === "/" && <MainNavBar />}
          {pathname === "/recipe" && <AllRecipeNavBar />}
          {pathname.startsWith("/recipe/") && <ViewRecipeNavBar />}
          {pathname === "/share-recipe" && <ShareRecipeNavBar />}
        </div>
      </header>
    </>
  );
}

const AllRecipeNavBar = () => {
  const { status } = useSession();
  const pathname = usePathname();
  console.log("pathname ; ", pathname);
  return (
    <>
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="#recipes"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          Home
        </Link>
        <Link
          href="#how-it-works"
          className="text-gray-600 hover:text-orange-500 transition-colors"
        >
          All Recipes
        </Link>
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
  const { status } = useSession();

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
      <nav className="hidden md:flex items-center space-x-8">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
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

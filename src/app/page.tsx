// src/app/page.tsx

import { Poetsen_One } from "next/font/google";
import localFont from "next/font/local";
import RecipeCard from "@/components/RecipeCard";

const poetsenOne = Poetsen_One({
  weight: "400",
  subsets: ["latin"],
});

const copperpot = localFont({
  src: "../../public/fonts/CopperPotBold.ttf",
});

export default function Home() {
  return (
    <div className="container-fluid mx-auto px-4 py-6 sm:px-10 md:px-20 lg:px-40 space-y-5">
      <div className="text-center">
        <span
          className={`text-md sm:text-md md:text-1xl lg:text-2xl font-normal ${copperpot.className}`}
        >
          Explore Lunch Recipes
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
        <RecipeCard />
      </div>
    </div>
  );
}

"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useState } from "react";
import clsx from "clsx";
import LoadingSpinner from "./LoadingSpinner";
import { Bookmark, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function HandleFavourite({
  mutateData,
  recipe,
  id,
}: {
  mutateData?: any;
  recipe: any;
  id?: number;
}) {
  const { status } = useSession();
  const [isFav, setIsFav] = useState(false);
  const pathname = usePathname();
  const isUserOnThisPage =
    pathname === "/favourite-recipe" || pathname === "/recipe";
  const isFavouriteRecipe =
    recipe?.result?.favourite?.[0]?.isFavourite === 1 ||
    recipe?.favourite?.[0]?.isFavourite === 1;
  const handleFavourite = async (recipeId: number) => {
    try {
      setIsFav(true);
      const response = await fetch("/api/favouriteRecipe", {
        method: "POST",
        body: JSON.stringify({ recipeId }),
      });

      const data = await response.json();

      if (response.ok) {
        await mutateData();
        setIsFav(false);
        toast.success("Success", {
          description: data?.message,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error", {
          description: error.message,
        });
      }
    } finally {
      setIsFav(false);
    }
  };
  return (
    <div>
      {isUserOnThisPage ? (
        <Button
          variant="ghost"
          size="sm"
          disabled={status === "unauthenticated" || isFav}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white p-2 cursor-pointer"
          onClick={() => handleFavourite(recipe.recipeId)}
        >
          {isFav ? (
            <LoadingSpinner />
          ) : (
            <>
              <Heart
                className="h-4 w-4 text-gray-600"
                fill={isFavouriteRecipe ? "red" : "white"}
                color={isFavouriteRecipe ? "red" : "black"}
              />
            </>
          )}
        </Button>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button
                className={clsx(
                  "w-full  cursor-pointer",
                  isFavouriteRecipe &&
                    "bg-pink-500  hover:bg-pink-400 hover:text-white text-white"
                )}
                disabled={status === "unauthenticated" || isFav}
                onClick={() => handleFavourite(id ?? 0)}
                variant={"outline"}
              >
                {isFav ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Save Recipe
                  </>
                )}
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent
            className={clsx(status === "authenticated" && "hidden")}
          >
            <p>Login to save recipe</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

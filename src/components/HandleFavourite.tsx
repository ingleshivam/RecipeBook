"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useState } from "react";
import clsx from "clsx";
import LoadingSpinner from "./LoadingSpinner";
import { Bookmark } from "lucide-react";

export default function HandleFavourite({
  mutateData,
  recipe,
  id,
}: {
  mutateData: any;
  recipe: any;
  id: number;
}) {
  const [isFav, setIsFav] = useState(false);

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
      <Button
        className={clsx(
          "w-full  cursor-pointer",
          recipe?.result?.favourite[0]?.isFavourite === 1 &&
            "bg-pink-500  hover:bg-pink-400 hover:text-white text-white"
        )}
        disabled={status === "unauthenticated" || isFav}
        onClick={() => handleFavourite(id)}
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
  );
}

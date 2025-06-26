"use client";
import useSWR from "swr";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FavouriteRecipe() {
  const router = useRouter();

  const {
    data: recipeData,
    isLoading: recipeLaoding,
    error: recipeError,
  } = useSWR("/api/getRecipeDeatils", fetcher);
  if (recipeLaoding)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );

  return (
    <section
      id="recipes"
      className="py-10 px-5 md:py-20 md:px-30 bg-gradient-to-b from-orange-50/50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            My Favorite Recipes{" "}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipeData.result

            .filter((item: any) => item.approveStatus === "A")
            .map((recipe: any, index: number) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{recipe.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">
                        {recipe.prepTime + recipe.cookTime}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer"
                      onClick={() => router.push(`/recipe/${recipe?.recipeId}`)}
                    >
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}

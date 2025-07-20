"use client";
import useSWR from "swr";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { ArrowLeft, Clock, Heart, Star, Users } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { category, difficulty } from "@/data/dropdownData";
import Link from "next/link";
import HandleFavourite from "./HandleFavourite";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FavouriteRecipe() {
  const router = useRouter();

  const {
    data: recipeData,
    isLoading: recipeLaoding,
    error: recipeError,
    mutate: mutateData,
  } = useSWR("/api/favouriteRecipe", fetcher);
  if (recipeLaoding)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loader"></span>
      </div>
    );
  console.log("Recipe data : ", recipeData);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-5 md:pb-0">
        <div className="container mx-auto px-5 md:px-34 py-8">
          <Link
            href="/recipe"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Recipes
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              My Favorite Recipes
            </h1>
          </div>
          {recipeData?.result?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {recipeData?.result?.map((recipe: any, index: number) => (
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
                      className="object-cover group-hover:scale-105 transition-transform duration-300 w-full h-48   "
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">
                        {recipe.rating}
                      </span>
                    </div>
                    {/* <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white p-2"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </Button> */}
                    <HandleFavourite recipe={recipe} mutateData={mutateData} />
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-700"
                        >
                          {
                            category.find(
                              (item) => item.value === recipe.category
                            )?.category_name
                          }
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-green-200 text-green-700"
                        >
                          {
                            difficulty.find(
                              (item) => item.value === recipe.difficulty
                            )?.diffuculty
                          }
                        </Badge>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{recipe.totalTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{recipe.servings}</span>
                          </div>
                        </div>
                        <span className="text-gray-400">
                          {recipe.reviews} reviews
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-gray-500">
                          by {recipe.author}
                        </span>
                        <Link href={`/recipe/${recipe.recipeId}`}>
                          <Button
                            variant="ghost"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 cursor-pointer"
                          >
                            View Recipe
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center w-full ">
              No favourite recipes found !
            </div>
          )}
        </div>
      </div>
    </>
  );
}

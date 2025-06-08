"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  ChefHat,
  Star,
  Heart,
  Share2,
  Bookmark,
  ArrowLeft,
  Timer,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function RecipeDetailsPage({ id }: { id: number }) {
  const [isDataLoading, setIsDataLoading] = useState(false);
  // const [recipe, setRecipe] = useState<any>([]);
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError,
  } = useSWR(`/api/getRecipeDetailsById?id=${id}`, fetcher);

  console.log("Recipe : ", recipe);
  return (
    <>
      {recipeLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <span className="text-2xl font-bold text-gray-800">
                  RecipeShare
                </span>
              </Link>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Recipe Header */}
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src={recipe.result.image || "/placeholder.svg"}
                      alt={recipe.result.title}
                      width={800}
                      height={600}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{recipe.rating || 0}</span>
                      <span className="text-gray-500">
                        ({recipe.reviews || ""})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700"
                      >
                        {recipe.result.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700"
                      >
                        {recipe.result.difficulty}
                      </Badge>
                      {recipe.result.tags.map((tag: any, index: number) => (
                        <Badge
                          key={tag + index}
                          variant="outline"
                          className="text-gray-600"
                        >
                          #{tag.tagId}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                      {recipe.result.title}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {recipe.result.description}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-orange-100">
                      <Image
                        src={recipe.result.author || "/placeholder.svg"}
                        alt={recipe.result.author}
                        width={50}
                        height={50}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {recipe.result.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {recipe.result.author} recipes shared
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Times & Servings */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <Timer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Prep Time</p>
                        <p className="font-semibold">
                          {recipe.result.prepTime}
                        </p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Cook Time</p>
                        <p className="font-semibold">
                          {recipe.result.cookTime}
                        </p>
                      </div>
                      <div className="text-center">
                        <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Servings</p>
                        <p className="font-semibold">
                          {recipe.result.servings}
                        </p>
                      </div>
                      <div className="text-center">
                        <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Total Time</p>
                        <p className="font-semibold">
                          {recipe.result.totalTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredients */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Ingredients
                    </h2>
                    <ul className="space-y-3">
                      {recipe.result.ingredients.map(
                        (ingredient: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <span className="font-medium text-orange-600 min-w-20">
                              {ingredient.quantity}
                            </span>
                            <span className="text-gray-700">
                              {ingredient.ingredient.name}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Instructions
                    </h2>
                    <ol className="space-y-4">
                      {recipe.result.instructions.map(
                        (item: any, index: number) => (
                          <li key={index} className="flex space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed pt-1">
                              {item.instruction.description}
                            </p>
                          </li>
                        )
                      )}
                    </ol>
                  </CardContent>
                </Card>

                {/* Tips */}
                {/* <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      Chef's Tips
                    </h2>
                    <ul className="space-y-3">
                      {recipe.tips.map((tip: any, index: number) => (
                        <li key={index} className="flex items-start space-x-3">
                          <ChefHat className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 leading-relaxed">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card> */}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Nutrition Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Nutrition (per serving)
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Calories</span>
                        <span className="font-medium">
                          {recipe.result.nutritionInfo[0].nutritionInfo.calorie}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fat</span>
                        <span className="font-medium">
                          {recipe.result.nutritionInfo[0].nutritionInfo.fat}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Carbs</span>
                        <span className="font-medium">
                          {recipe.result.nutritionInfo[0].nutritionInfo.carbs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Protein</span>
                        <span className="font-medium">
                          {recipe.result.nutritionInfo[0].nutritionInfo.protein}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sugar</span>
                        <span className="font-medium">
                          {recipe.result.nutritionInfo[0].nutritionInfo.sugar}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Recipe
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Recipe
                    </Button>
                    <Button variant="outline" className="w-full">
                      Print Recipe
                    </Button>
                  </CardContent>
                </Card>

                {/* Related Recipes */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      More from {recipe.author}
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex space-x-3">
                          <Image
                            src={`/placeholder.svg?height=60&width=60`}
                            alt="Related recipe"
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              Chocolate Brownies
                            </p>
                            <p className="text-sm text-gray-500">
                              25 min • 4.8 ⭐
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

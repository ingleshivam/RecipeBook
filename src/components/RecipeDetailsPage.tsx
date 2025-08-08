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
import useSWR, { mutate } from "swr";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import LoadingSpinner from "./LoadingSpinner";
import HandleFavourite from "./HandleFavourite";
import RatingComponent from "./RatingComponent";
import ShareRecipe from "./ShareRecipe";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RecipeDetailsPage({ id }: { id: number }) {
  const { status } = useSession();
  const [isDataLoading, setIsDataLoading] = useState(false);
  const pathname = usePathname();
  const {
    data: recipe,
    isLoading: recipeLoading,
    error: recipeError,
    mutate: mutateData,
  } = useSWR(`/api/getRecipeDetailsById?id=${id}`, fetcher);

  const handlePrint = () => {
    if (!recipe) return;

    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center; margin-bottom: 20px;">${
          recipe.result.title
        }</h1>
        
        <div style="margin-bottom: 20px;">
          <p style="color: #666; line-height: 1.6;">${
            recipe.result.description
          }</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px;">
          <div>
            <h3 style="color: #333;">Prep Time</h3>
            <p>${recipe.result.prepTime}</p>
          </div>
          <div>
            <h3 style="color: #333;">Cook Time</h3>
            <p>${recipe.result.cookTime}</p>
          </div>
          <div>
            <h3 style="color: #333;">Servings</h3>
            <p>${recipe.result.servings}</p>
          </div>
          <div>
            <h3 style="color: #333;">Total Time</h3>
            <p>${recipe.result.totalTime}</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Ingredients</h2>
          <ul style="list-style-type: none; padding: 0;">
            ${recipe.result.ingredients
              .map(
                (ingredient: any) => `
              <li style="margin-bottom: 10px; display: flex; gap: 10px;">
                <span style="color: #f97316; font-weight: bold;">${ingredient.quantity}</span>
                <span>${ingredient.ingredient.name}</span>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Instructions</h2>
          <ol style="padding-left: 20px;">
            ${recipe.result.instructions
              .map(
                (item: any, index: number) => `
              <li style="margin-bottom: 15px; line-height: 1.6;">
                ${item.instruction.description}
              </li>
            `
              )
              .join("")}
          </ol>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #333; border-bottom: 2px solid #f97316; padding-bottom: 10px;">Nutrition Information</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div>
              <strong>Calories:</strong> ${
                recipe.result.nutritionInfo[0].nutritionInfo.calorie
              }
            </div>
            <div>
              <strong>Fat:</strong> ${
                recipe.result.nutritionInfo[0].nutritionInfo.fat
              }
            </div>
            <div>
              <strong>Carbs:</strong> ${
                recipe.result.nutritionInfo[0].nutritionInfo.carbs
              }
            </div>
            <div>
              <strong>Protein:</strong> ${
                recipe.result.nutritionInfo[0].nutritionInfo.protein
              }
            </div>
            <div>
              <strong>Sugar:</strong> ${
                recipe.result.nutritionInfo[0].nutritionInfo.sugar
              }
            </div>
          </div>
        </div>

        <div style="text-align: center; color: #666; font-size: 0.9em; margin-top: 40px;">
          <p>Recipe from RecipeShare</p>
          <p>Printed on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
          <html>
            <head>
              <title>${recipe.result.title} - Recipe</title>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <>
      {recipeLoading ? (
        <div className="flex items-center justify-center h-screen">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-5 md:pb-0">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Back Button */}
            <Link
              href="/recipe"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4 sm:mb-6 text-sm sm:text-base"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Recipe Header */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
                    <Image
                      src={recipe.result.image || "/placeholder.svg"}
                      alt={recipe.result.title}
                      width={800}
                      height={600}
                      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                    />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 flex items-center space-x-1">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-sm sm:text-base">
                        {recipe?.result?.reviewRating || 0}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm">
                        ({recipe?.result?.totalReviewCount?.recipeId || ""})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-orange-100 text-orange-700 text-xs sm:text-sm"
                      >
                        {recipe.result.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700 text-xs sm:text-sm"
                      >
                        {recipe.result.difficulty}
                      </Badge>
                      {recipe.result.tags.map((tag: any, index: number) => (
                        <Badge
                          key={tag + index}
                          variant="outline"
                          className="text-gray-600 text-xs sm:text-sm"
                        >
                          {tag.tag.name}
                        </Badge>
                      ))}
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                      {recipe.result.title}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      {recipe.result.description}
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-lg border border-orange-100">
                      <Image
                        src={
                          "https://ui-avatars.com/api/?name=Shivam+Ingle&rounded=true"
                        }
                        alt={recipe.result.author}
                        width={40}
                        height={40}
                        className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
                      />
                      <div>
                        <p className="font-semibold text-gray-800 text-sm sm:text-base">
                          {recipe.result.author}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {recipe.count.recipeId} recipes shared
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recipe Times & Servings */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="text-center">
                        <Timer className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">
                          Prep Time
                        </p>
                        <p className="font-semibold text-sm sm:text-base">
                          {recipe.result.prepTime}
                        </p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">
                          Cook Time
                        </p>
                        <p className="font-semibold text-sm sm:text-base">
                          {recipe.result.cookTime}
                        </p>
                      </div>
                      <div className="text-center">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">
                          Servings
                        </p>
                        <p className="font-semibold text-sm sm:text-base">
                          {recipe.result.servings}
                        </p>
                      </div>
                      <div className="text-center">
                        <Utensils className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 mx-auto mb-1 sm:mb-2" />
                        <p className="text-xs sm:text-sm text-gray-500">
                          Total Time
                        </p>
                        <p className="font-semibold text-sm sm:text-base">
                          {recipe.result.totalTime}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ingredients */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                      Ingredients
                    </h2>
                    <ul className="space-y-2 sm:space-y-3">
                      {recipe.result.ingredients.map(
                        (ingredient: any, index: number) => (
                          <li
                            key={index}
                            className="flex items-center space-x-2 sm:space-x-3"
                          >
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <span className="font-medium text-orange-600 min-w-16 sm:min-w-20 text-sm sm:text-base">
                              {ingredient.quantity}
                            </span>
                            <span className="text-gray-700 text-sm sm:text-base">
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
                  <CardContent className="p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                      Instructions
                    </h2>
                    <ol className="space-y-3 sm:space-y-4">
                      {recipe.result.instructions.map(
                        (item: any, index: number) => (
                          <li
                            key={index}
                            className="flex space-x-3 sm:space-x-4"
                          >
                            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 leading-relaxed pt-0 sm:pt-1 text-sm sm:text-base">
                              {item.instruction.description}
                            </p>
                          </li>
                        )
                      )}
                    </ol>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-6">
                {/* Nutrition Info */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      Nutrition
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Calories
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {recipe.result.nutritionInfo[0].nutritionInfo.calorie}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Fat
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {recipe.result.nutritionInfo[0].nutritionInfo.fat}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Carbs
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {recipe.result.nutritionInfo[0].nutritionInfo.carbs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Protein
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {recipe.result.nutritionInfo[0].nutritionInfo.protein}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm sm:text-base">
                          Sugar
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {recipe.result.nutritionInfo[0].nutritionInfo.sugar}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <HandleFavourite
                      mutateData={mutateData}
                      recipe={recipe}
                      id={id}
                    />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger>
                                <Button
                                  variant="outline"
                                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 cursor-pointer text-sm sm:text-base"
                                  disabled={status === "unauthenticated"}
                                >
                                  <Share2 className="h-4 w-4 mr-2" />
                                  Share Recipe
                                </Button>{" "}
                              </AccordionTrigger>
                              <AccordionContent className="flex flex-col gap-4 text-balance">
                                <div>
                                  <ShareRecipe
                                    link={pathname}
                                    name={recipe.result.title}
                                  />
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        className={clsx(status === "authenticated" && "hidden")}
                      >
                        <p>Login to share recipe</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Button
                            variant="outline"
                            className="w-full cursor-pointer text-sm sm:text-base"
                            onClick={handlePrint}
                            disabled={status === "unauthenticated"}
                          >
                            Print Recipe
                          </Button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        className={clsx(status === "authenticated" && "hidden")}
                      >
                        <p>Login to print recipe</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardContent>
                </Card>

                {/* Related Recipes */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                      More from - {recipe?.result?.author}
                    </h3>
                    <div className="space-y-3 sm:space-y-4">
                      {recipe.allRecipesByUseId?.length > 0 ? (
                        recipe.allRecipesByUseId.map(
                          (item: any, index: number) => (
                            <div
                              key={item.recipeId}
                              className="flex space-x-2 sm:space-x-3"
                            >
                              <Image
                                src={`${item.images[0].imageUrl}`}
                                alt="Related recipe"
                                width={40}
                                height={40}
                                className="rounded-full object-cover aspect-square w-10 h-10 sm:w-12 sm:h-12"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate text-sm sm:text-base">
                                  <Link href={`/recipe/${item.recipeId}`}>
                                    {item.title}
                                  </Link>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500">
                                  {item.prepTime + item.cookingTime}
                                  min • 4.8 ⭐
                                </p>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <span className="text-sm sm:text-base">
                          No More Recipes
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {/* Rating Card */}

                <RatingComponent recipeId={id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

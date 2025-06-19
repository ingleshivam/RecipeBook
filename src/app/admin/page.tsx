"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ChefHat,
  Search,
  Filter,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  TrendingUp,
  Star,
  AlertCircle,
  Utensils,
  Timer,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { category, difficulty } from "../../../public/dropdownData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import clsx from "clsx";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function AdminPage() {
  const {
    data: response,
    isLoading: responseLoading,
    error: responseError,
    mutate: mutateData,
  } = useSWR("/api/getRecipeDeatils", fetcher);

  const {
    data: userData,
    isLoading: userDataLoading,
    error: userDataError,
  } = useSWR("/api/getUserDetails", fetcher);

  const pendingRecipes =
    response?.result?.filter((item: any) => item.approveStatus == "U") || [];

  const approvedRecipes =
    response?.result?.filter((item: any) => item.approveStatus == "A") || [];

  const rejectedRecipes =
    response?.result?.filter((item: any) => item.approveStatus == "R") || [];

  console.log("Response :", response);
  console.log("userData :", userData);

  const [recipeViewDetails, setRecipeViewDetails] = useState<any>([]);
  const [selectedTab, setSelectedTab] = useState("pending");

  const handleApprove = async (recipeId: number) => {
    const status = "A";
    const response = await fetch("/api/getRecipeDetailsById", {
      method: "PUT",
      body: JSON.stringify({ recipeId, status }),
    });

    if (response.ok) {
      console.log("Status text : ", response.statusText);
      toast.success("Success", {
        description: response.statusText,
      });
    }

    await mutateData();
  };

  const handleReject = async (recipeId: number) => {
    const status = "R";
    const response = await fetch("/api/getRecipeDetailsById", {
      method: "PUT",
      body: JSON.stringify({ recipeId, status }),
    });

    if (response.ok) {
      console.log("Status text : ", response.statusText);
      toast.success("Success", {
        description: response.statusText,
      });
    }

    await mutateData();
  };

  const hadleViewDetails = (recipeId: number) => {
    const getReleventRecipe = response.result.find(
      (item: any) => item.recipeId === recipeId
    );
    setRecipeViewDetails(getReleventRecipe);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white md:px-30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage recipe submissions and community content
          </p>
        </div>

        {/* Stats Cards */}
        {!responseLoading && !userDataLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Recipes</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {response?.result?.length}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ChefHat className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Reviews</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {
                          response.result.filter(
                            (item: any) => item.approvedStatus === "U"
                          )?.length
                        }
                      </p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Approved Today</p>
                      <p className="text-2xl font-bold text-green-600">
                        {
                          response.result.filter((item: any) => {
                            const today = new Date();
                            const approvedDate = new Date(item.approvedDate);
                            return (
                              approvedDate.toDateString() ===
                              today.toDateString()
                            );
                          })?.length
                        }
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {userData?.response?.length}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <TabsList className="grid w-full sm:w-full sm:h-11 grid-cols-3">
                  <TabsTrigger value="pending">
                    Pending ({pendingRecipes?.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="pending" className="space-y-6">
                <Card className="py-6 md:p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Pending Recipe Reviews
                    </CardTitle>
                    <CardDescription>
                      Review and approve new recipe submissions from the
                      community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pendingRecipes?.map((recipe: any, index: number) => (
                        <div
                          key={recipe.recipeId + index}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Recipe Image */}
                            <div className="lg:w-48 flex-shrink-0">
                              <Image
                                src={recipe.image || "/placeholder.svg"}
                                alt={recipe.title}
                                width={300}
                                height={200}
                                className="w-full h-32 lg:h-32 object-cover rounded-lg"
                              />
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {recipe.title}
                                  </h3>
                                  <p className="text-gray-600 mb-3">
                                    {recipe.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-100 text-orange-700"
                                    >
                                      {
                                        category.find(
                                          (item) =>
                                            item.value === recipe.category
                                        )?.category_name
                                      }
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 text-green-700"
                                    >
                                      {
                                        difficulty.find(
                                          (item) =>
                                            item.value === recipe.difficulty
                                        )?.diffuculty
                                      }
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Submitted by
                                  </p>
                                  <p className="font-medium text-gray-800">
                                    {recipe.author}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {recipe?.user?.email}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(recipe.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Recipe Stats */}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Prep: {recipe.prepTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Cook: {recipe.cookTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{recipe.servings} servings</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-3 pt-2">
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                      onClick={() =>
                                        hadleViewDetails(recipe.recipeId)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className="w-[100%] sm:max-w-[50%] md:text-2xl">
                                    <ScrollArea className="h-[100%] ">
                                      <SheetHeader className="space-y-4">
                                        <SheetTitle>
                                          {recipeViewDetails?.title}
                                        </SheetTitle>
                                        <SheetDescription className="leading-7">
                                          {recipeViewDetails?.description}
                                        </SheetDescription>
                                      </SheetHeader>
                                      <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                              <Timer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Prep Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.prepTime}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Cook Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.cookTime}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Servings
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.servings}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Total Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.totalTime}
                                              </p>
                                            </div>
                                          </div>

                                          <div>
                                            <span className="font-medium text-1xl">
                                              Ingredients
                                            </span>
                                            <ul className="space-y-3 text-sm mt-4 px-10">
                                              {recipe.ingredients.map(
                                                (
                                                  ingredient: any,
                                                  index: number
                                                ) => (
                                                  <li
                                                    key={index}
                                                    className="flex items-center space-x-3"
                                                  >
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                                    <span className="font-medium text-orange-600 min-w-20">
                                                      {ingredient.quantity}
                                                    </span>
                                                    <span className="text-gray-700">
                                                      {
                                                        ingredient.ingredient
                                                          .name
                                                      }
                                                    </span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>

                                          <div>
                                            <span className="font-medium text-1xl">
                                              Instructions
                                            </span>
                                            <ol className="space-y-3 text-sm mt-4 px-10">
                                              {recipe.instructions.map(
                                                (item: any, index: number) => (
                                                  <li
                                                    key={index}
                                                    className="flex space-x-4"
                                                  >
                                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                      {index + 1}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed pt-1">
                                                      {
                                                        item.instruction
                                                          .description
                                                      }
                                                    </p>
                                                  </li>
                                                )
                                              )}
                                            </ol>
                                          </div>

                                          <div>
                                            <h3 className="text-1xl font-medium">
                                              Nutrition
                                            </h3>
                                            <div className="space-y-3 text-sm mt-4 px-10">
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Calories
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.calorie
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Fat
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.fat
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Carbs
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.carbs
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Protein
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.protein
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Sugar
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.sugar
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <SheetFooter>
                                        <SheetClose asChild>
                                          <Button
                                            variant="outline"
                                            className="cursor-pointer"
                                          >
                                            Close
                                          </Button>
                                        </SheetClose>
                                      </SheetFooter>
                                    </ScrollArea>
                                  </SheetContent>
                                </Sheet>

                                <Button
                                  size="sm"
                                  type="button"
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => handleApprove(recipe.recipeId)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  type="button"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(recipe.recipeId)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                {/* <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {pendingRecipes?.length === 0 && (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          All caught up!
                        </h3>
                        <p className="text-gray-600">
                          No pending recipes to review at the moment.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Approved Recipes
                    </CardTitle>
                    <CardDescription>
                      Recently approved recipes that are now live on the
                      platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {approvedRecipes?.map((recipe: any, index: number) => (
                        <div
                          key={recipe.recipeId + index}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Recipe Image */}
                            <div className="lg:w-48 flex-shrink-0">
                              <Image
                                src={recipe.image || "/placeholder.svg"}
                                alt={recipe.title}
                                width={300}
                                height={200}
                                className="w-full h-32 lg:h-32 object-cover rounded-lg"
                              />
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {recipe.title}
                                  </h3>
                                  <p className="text-gray-600 mb-3">
                                    {recipe.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-100 text-orange-700"
                                    >
                                      {
                                        category.find(
                                          (item) =>
                                            item.value === recipe.category
                                        )?.category_name
                                      }
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 text-green-700"
                                    >
                                      {
                                        difficulty.find(
                                          (item) =>
                                            item.value === recipe.difficulty
                                        )?.diffuculty
                                      }
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Submitted by
                                  </p>
                                  <p className="font-medium text-gray-800">
                                    {recipe.author}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {recipe?.user?.email}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(recipe.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Recipe Stats */}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Prep: {recipe.prepTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Cook: {recipe.cookTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{recipe.servings} servings</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-3 pt-2">
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                      onClick={() =>
                                        hadleViewDetails(recipe.recipeId)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className="w-[100%] sm:max-w-[50%] md:text-2xl">
                                    <ScrollArea className="h-[100%] ">
                                      <SheetHeader className="space-y-4">
                                        <SheetTitle>
                                          {recipeViewDetails?.title}
                                        </SheetTitle>
                                        <SheetDescription className="leading-7">
                                          {recipeViewDetails?.description}
                                        </SheetDescription>
                                      </SheetHeader>
                                      <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                              <Timer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Prep Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.prepTime}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Cook Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.cookTime}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Servings
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.servings}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Total Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.totalTime}
                                              </p>
                                            </div>
                                          </div>

                                          <div>
                                            <span className="font-medium text-1xl">
                                              Ingredients
                                            </span>
                                            <ul className="space-y-3 text-sm mt-4 px-10">
                                              {recipe.ingredients.map(
                                                (
                                                  ingredient: any,
                                                  index: number
                                                ) => (
                                                  <li
                                                    key={index}
                                                    className="flex items-center space-x-3"
                                                  >
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                                    <span className="font-medium text-orange-600 min-w-20">
                                                      {ingredient.quantity}
                                                    </span>
                                                    <span className="text-gray-700">
                                                      {
                                                        ingredient.ingredient
                                                          .name
                                                      }
                                                    </span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>

                                          <div>
                                            <span className="font-medium text-1xl">
                                              Instructions
                                            </span>
                                            <ol className="space-y-3 text-sm mt-4 px-10">
                                              {recipe.instructions.map(
                                                (item: any, index: number) => (
                                                  <li
                                                    key={index}
                                                    className="flex space-x-4"
                                                  >
                                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                      {index + 1}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed pt-1">
                                                      {
                                                        item.instruction
                                                          .description
                                                      }
                                                    </p>
                                                  </li>
                                                )
                                              )}
                                            </ol>
                                          </div>

                                          <div>
                                            <h3 className="text-1xl font-medium">
                                              Nutrition
                                            </h3>
                                            <div className="space-y-3 text-sm mt-4 px-10">
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Calories
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.calorie
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Fat
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.fat
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Carbs
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.carbs
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Protein
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.protein
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Sugar
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.sugar
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <SheetFooter>
                                        <SheetClose asChild>
                                          <Button
                                            variant="outline"
                                            className="cursor-pointer"
                                          >
                                            Close
                                          </Button>
                                        </SheetClose>
                                      </SheetFooter>
                                    </ScrollArea>
                                  </SheetContent>
                                </Sheet>

                                <Button
                                  size="sm"
                                  type="button"
                                  className={clsx(
                                    "bg-green-500 hover:bg-green-600 text-white",
                                    recipe.approveStatus === "A" && "hidden"
                                  )}
                                  onClick={() => handleApprove(recipe.recipeId)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  type="button"
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                  onClick={() => handleReject(recipe.recipeId)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                {/* <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {approvedRecipes?.length === 0 && (
                      <div className="text-center py-12">
                        <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Approved Recipes
                        </h3>
                        <p className="text-gray-600">
                          View and manage all approved recipes here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rejected" className="space-y-6">
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Rejected Recipes
                    </CardTitle>
                    <CardDescription>
                      Recipes that were rejected and the reasons for rejection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {rejectedRecipes?.map((recipe: any, index: number) => (
                        <div
                          key={recipe.recipeId + index}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Recipe Image */}
                            <div className="lg:w-48 flex-shrink-0">
                              <Image
                                src={recipe.image || "/placeholder.svg"}
                                alt={recipe.title}
                                width={300}
                                height={200}
                                className="w-full h-32 lg:h-32 object-cover rounded-lg"
                              />
                            </div>

                            {/* Recipe Details */}
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div>
                                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {recipe.title}
                                  </h3>
                                  <p className="text-gray-600 mb-3">
                                    {recipe.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Badge
                                      variant="secondary"
                                      className="bg-orange-100 text-orange-700"
                                    >
                                      {
                                        category.find(
                                          (item) =>
                                            item.value === recipe.category
                                        )?.category_name
                                      }
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-green-200 text-green-700"
                                    >
                                      {
                                        difficulty.find(
                                          (item) =>
                                            item.value === recipe.difficulty
                                        )?.diffuculty
                                      }
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:items-end">
                                  <p className="text-sm text-gray-500 mb-1">
                                    Submitted by
                                  </p>
                                  <p className="font-medium text-gray-800">
                                    {recipe.author}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {recipe?.user?.email}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatDate(recipe.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Recipe Stats */}
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Prep: {recipe.prepTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>Cook: {recipe.cookTime}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{recipe.servings} servings</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-3 pt-2">
                                <Sheet>
                                  <SheetTrigger asChild>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                      onClick={() =>
                                        hadleViewDetails(recipe.recipeId)
                                      }
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                  </SheetTrigger>
                                  <SheetContent className="w-[100%] sm:max-w-[50%] md:text-2xl">
                                    <ScrollArea className="h-[100%] ">
                                      <SheetHeader className="space-y-4">
                                        <SheetTitle>
                                          {recipeViewDetails?.title}
                                        </SheetTitle>
                                        <SheetDescription className="leading-7">
                                          {recipeViewDetails?.description}
                                        </SheetDescription>
                                      </SheetHeader>
                                      <div className="grid flex-1 auto-rows-min gap-6 px-4">
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                              <Timer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Prep Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.prepTime}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Cook Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.cookTime}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Servings
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.servings}
                                              </p>
                                            </div>
                                            <div className="text-center">
                                              <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                                              <p className="text-sm text-gray-500">
                                                Total Time
                                              </p>
                                              <p className="font-semibold text-lg">
                                                {recipe?.totalTime}
                                              </p>
                                            </div>
                                          </div>

                                          <div>
                                            <span className="font-medium text-1xl">
                                              Ingredients
                                            </span>
                                            <ul className="space-y-3 text-sm mt-4 px-10">
                                              {recipe.ingredients.map(
                                                (
                                                  ingredient: any,
                                                  index: number
                                                ) => (
                                                  <li
                                                    key={index}
                                                    className="flex items-center space-x-3"
                                                  >
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                                                    <span className="font-medium text-orange-600 min-w-20">
                                                      {ingredient.quantity}
                                                    </span>
                                                    <span className="text-gray-700">
                                                      {
                                                        ingredient.ingredient
                                                          .name
                                                      }
                                                    </span>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </div>

                                          <div>
                                            <span className="font-medium text-1xl">
                                              Instructions
                                            </span>
                                            <ol className="space-y-3 text-sm mt-4 px-10">
                                              {recipe.instructions.map(
                                                (item: any, index: number) => (
                                                  <li
                                                    key={index}
                                                    className="flex space-x-4"
                                                  >
                                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                                                      {index + 1}
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed pt-1">
                                                      {
                                                        item.instruction
                                                          .description
                                                      }
                                                    </p>
                                                  </li>
                                                )
                                              )}
                                            </ol>
                                          </div>

                                          <div>
                                            <h3 className="text-1xl font-medium">
                                              Nutrition
                                            </h3>
                                            <div className="space-y-3 text-sm mt-4 px-10">
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Calories
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.calorie
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Fat
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.fat
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Carbs
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.carbs
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Protein
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.protein
                                                  }
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Sugar
                                                </span>
                                                <span className="font-medium">
                                                  {
                                                    recipe.nutritionInfo[0]
                                                      .nutritionInfo.sugar
                                                  }
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <SheetFooter>
                                        <SheetClose asChild>
                                          <Button
                                            variant="outline"
                                            className="cursor-pointer"
                                          >
                                            Close
                                          </Button>
                                        </SheetClose>
                                      </SheetFooter>
                                    </ScrollArea>
                                  </SheetContent>
                                </Sheet>

                                <Button
                                  size="sm"
                                  type="button"
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  onClick={() => handleApprove(recipe.recipeId)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  type="button"
                                  className={clsx(
                                    "border-red-200 text-red-600 hover:bg-red-50",
                                    recipe.approveStatus === "R" && "hidden"
                                  )}
                                  onClick={() => handleReject(recipe.recipeId)}
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                {/* <Button size="sm" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {rejectedRecipes?.length === 0 && (
                      <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          Rejected Recipes
                        </h3>
                        <p className="text-gray-600">
                          View rejected recipes and rejection reasons here.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-8 p-6">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <Star className="h-6 w-6" />
                    <span>Featured Recipes</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
}

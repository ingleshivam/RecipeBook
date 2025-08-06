"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ChefHat,
  Search,
  Clock,
  Users,
  Star,
  Heart,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ListFilter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import {
  category,
  difficulty,
  sortOptions,
} from "../../public/dropdownData.js";
import ViewAllRecipesSkeleton from "./skeleton/ViewAllRecipeSkeleton";
import HandleFavourite from "./HandleFavourite";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function ViewAllRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");
  const [selectedDifficulty, setSelectedDifficulty] = useState("0");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const recipesPerPage = 12;

  const {
    data: response,
    isLoading: recipesLoading,
    error: recipesError,
    mutate: mutateData,
  } = useSWR("/api/getRecipeDeatils", fetcher);

  if (recipesError) return <div>Error loading recipes</div>;

  const filteredAndSortedRecipes = useMemo(() => {
    if (!response?.result) return [];

    const filteredRecipes = response.result.filter((item: any) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === "0" || item.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "0" || item.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    filteredRecipes?.sort((a: any, b: any) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filteredRecipes || [];
  }, [response, searchTerm, selectedCategory, selectedDifficulty, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedRecipes.length / recipesPerPage
  );
  const startIndex = (currentPage - 1) * recipesPerPage;
  const paginatedRecipes = filteredAndSortedRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("0");
    setSelectedDifficulty("0");
    setSelectedTags([]);
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-5 md:pb-0">
      <div className="container mx-auto px-5 md:px-34 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            All Recipes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of delicious recipes from our community of
            passionate home cooks
          </p>
        </div>
        <div className="space-y-3 mb-10">
          <Card className="relative max-w-2xl mx-auto mb-10 rounded-md">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search recipes, ingredients, or authors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 pr-4 py-5 text-lg border-gray-200 focus:border-red-500 focus:ring-orange-500 :outline-none"
            />
          </Card>

          <div className="flex gap-3 justify-between md:grid md:grid-cols-3 md:gap-8">
            <Card className="rounded-md w-full">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full py-5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">All Categories</SelectItem>
                    {category.map((item, index) => (
                      <SelectItem key={item.value + index} value={item.value}>
                        {item.category_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>

            <Card className="rounded-md w-full">
              <Select
                value={selectedDifficulty}
                onValueChange={(value) => setSelectedDifficulty(value)}
              >
                <SelectTrigger className="w-full py-5 ">
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">All Levels</SelectItem>
                    {difficulty.map((item, index) => (
                      <SelectItem key={item.value + index} value={item.value}>
                        {item.diffuculty}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>

            <Card className="rounded-md w-fit md:w-full">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-full py-5">
                  <span className="hidden md:block">
                    <SelectValue placeholder="Select a filter" />
                  </span>
                  <span className="md:hidden">
                    <ListFilter />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {sortOptions.map((item, index) => (
                      <SelectItem key={item.value + index} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>
          </div>
        </div>

        {recipesLoading ? (
          <ViewAllRecipesSkeleton viewMode={viewMode} />
        ) : !response?.result ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {/* Loading recipes... */}
                No recipes found
              </h3>
              {/* <p className="text-gray-600 mb-6">
                Please wait while we fetch the recipes.
              </p> */}
            </div>
          </div>
        ) : paginatedRecipes.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                : "space-y-6 mb-8 "
            }
          >
            {paginatedRecipes?.map((recipe: any, index: number) => (
              <Card
                key={index}
                className={` group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-48 flex-shrink-0" : "rounded-t-lg"
                  }`}
                >
                  <Image
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    width={400}
                    height={300}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === "list" ? "w-48 h-32" : "w-full h-48"
                    }`}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{recipe.rating}</span>
                  </div>
                  <HandleFavourite recipe={recipe} mutateData={mutateData} />
                </div>
                <CardContent
                  className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                >
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
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No recipes found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="border-gray-200"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={
                      currentPage === pageNumber
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "border-gray-200 hover:bg-gray-50"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="border-gray-200"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

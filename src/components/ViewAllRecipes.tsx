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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { category, difficulty } from "../../public/dropdownData.js";
import ViewAllRecipesSkeleton from "./skeleton/ViewAllRecipeSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewAllRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");

  console.log("selectedCategory : ", selectedCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
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
  } = useSWR("/api/getRecipeDeatils", fetcher);

  if (recipesLoading) return <ViewAllRecipesSkeleton viewMode={viewMode} />;
  if (recipesError) return <div>Error loading recipes</div>;
  if (!response?.result || !Array.isArray(response.result))
    return <div>No recipes found</div>;

  const filteredRecipes = response.result.filter((item: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.author.toLowerCase().includes(searchLower);

    const matchesCategory =
      selectedCategory === "0" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  console.log("Filtered recipes:", filteredRecipes);
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-34 py-8">
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

          <div className="grid grid-cols-3 gap-8">
            <Card className="rounded-md">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="0">All Categories</SelectItem>
                    {category.map((item) => (
                      <SelectItem value={item.value}>
                        {item.category_name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>
            <Card className="rounded-md">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>
            <Card className="rounded-md">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Card>
          </div>
        </div>

        {recipesLoading ? (
          <ViewAllRecipesSkeleton viewMode={viewMode} />
        ) : filteredRecipes?.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                : "space-y-6 mb-8 "
            }
          >
            {filteredRecipes?.map((recipe: any, index: number) => (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white p-2"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </Button>
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
                        {recipe.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700"
                      >
                        {recipe.difficulty}
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
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
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
            </div>
          </div>
        )}
        {/* Recipe Grid/List */}
        {}
      </div>
    </div>
  );
}

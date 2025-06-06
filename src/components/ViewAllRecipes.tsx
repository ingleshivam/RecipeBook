"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
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

// Mock recipe data
const allRecipes = [
  {
    id: 1,
    title: "Grandma's Chocolate Chip Cookies",
    description:
      "Soft, chewy, and loaded with chocolate chips. A family recipe passed down through generations.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Sarah Johnson",
    rating: 4.9,
    reviews: 127,
    prepTime: "15 min",
    cookTime: "10 min",
    totalTime: "25 min",
    servings: 24,
    difficulty: "Easy",
    category: "Desserts",
    tags: ["cookies", "chocolate", "family-recipe", "comfort-food"],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    title: "Mediterranean Quinoa Bowl",
    description:
      "Fresh, healthy, and bursting with Mediterranean flavors. Perfect for a nutritious lunch.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Alex Chen",
    rating: 4.8,
    reviews: 89,
    prepTime: "10 min",
    cookTime: "5 min",
    totalTime: "15 min",
    servings: 2,
    difficulty: "Easy",
    category: "Main Course",
    tags: ["healthy", "vegetarian", "mediterranean", "quinoa"],
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    title: "Homemade Sourdough Bread",
    description:
      "Artisanal sourdough with a perfect crust and tangy flavor. Worth the wait!",
    image: "/placeholder.svg?height=300&width=400",
    author: "Emma Baker",
    rating: 4.9,
    reviews: 203,
    prepTime: "30 min",
    cookTime: "45 min",
    totalTime: "4 hours",
    servings: 8,
    difficulty: "Hard",
    category: "Bread & Baking",
    tags: ["bread", "sourdough", "artisanal", "fermented"],
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    title: "Thai Green Curry",
    description:
      "Authentic Thai flavors with coconut milk, fresh herbs, and aromatic spices.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Ploy Siriporn",
    rating: 4.7,
    reviews: 156,
    prepTime: "20 min",
    cookTime: "10 min",
    totalTime: "30 min",
    servings: 4,
    difficulty: "Medium",
    category: "Main Course",
    tags: ["thai", "curry", "spicy", "coconut"],
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    title: "Classic Beef Lasagna",
    description:
      "Layers of pasta, rich meat sauce, and melted cheese. Comfort food at its finest.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Tony Romano",
    rating: 4.8,
    reviews: 178,
    prepTime: "45 min",
    cookTime: "45 min",
    totalTime: "1.5 hours",
    servings: 8,
    difficulty: "Medium",
    category: "Main Course",
    tags: ["italian", "pasta", "beef", "comfort-food"],
    createdAt: "2024-01-11",
  },
  {
    id: 6,
    title: "Lemon Blueberry Muffins",
    description:
      "Fluffy muffins bursting with fresh blueberries and bright lemon flavor.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Lisa Park",
    rating: 4.6,
    reviews: 94,
    prepTime: "15 min",
    cookTime: "20 min",
    totalTime: "35 min",
    servings: 12,
    difficulty: "Easy",
    category: "Breakfast",
    tags: ["muffins", "blueberry", "lemon", "breakfast"],
    createdAt: "2024-01-10",
  },
  {
    id: 7,
    title: "Avocado Toast Supreme",
    description:
      "Elevated avocado toast with poached egg, everything seasoning, and microgreens.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Jordan Smith",
    rating: 4.5,
    reviews: 67,
    prepTime: "10 min",
    cookTime: "5 min",
    totalTime: "15 min",
    servings: 2,
    difficulty: "Easy",
    category: "Breakfast",
    tags: ["avocado", "toast", "healthy", "quick"],
    createdAt: "2024-01-09",
  },
  {
    id: 8,
    title: "Chicken Tikka Masala",
    description:
      "Creamy, aromatic Indian curry with tender chicken in a rich tomato-based sauce.",
    image: "/placeholder.svg?height=300&width=400",
    author: "Priya Sharma",
    rating: 4.9,
    reviews: 234,
    prepTime: "30 min",
    cookTime: "25 min",
    totalTime: "55 min",
    servings: 6,
    difficulty: "Medium",
    category: "Main Course",
    tags: ["indian", "curry", "chicken", "spicy"],
    createdAt: "2024-01-08",
  },
];

const categories = [
  "All Categories",
  "Main Course",
  "Desserts",
  "Breakfast",
  "Bread & Baking",
  "Appetizers",
  "Beverages",
  "Snacks",
];

const difficulties = ["All Levels", "Easy", "Medium", "Hard"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "title", label: "Alphabetical" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ViewAllRecipes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const recipesPerPage = 12;

  const {
    data: allRecipes1,
    isLoading: recipesLoading,
    error: recipesError,
  } = useSWR("/api/getRecipeDeatils", fetcher);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allRecipes.forEach((recipe) => {
      recipe.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    const filtered = allRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        recipe.category === selectedCategory;
      const matchesDifficulty =
        selectedDifficulty === "All Levels" ||
        recipe.difficulty === selectedDifficulty;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => recipe.tags.includes(tag));

      return (
        matchesSearch && matchesCategory && matchesDifficulty && matchesTags
      );
    });

    // Sort recipes
    filtered.sort((a, b) => {
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

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedTags, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedRecipes.length / recipesPerPage
  );
  const startIndex = (currentPage - 1) * recipesPerPage;
  const paginatedRecipes = filteredAndSortedRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedDifficulty("All Levels");
    setSelectedTags([]);
    setSortBy("newest");
    setCurrentPage(1);
  };
  if (recipesLoading) return <div>Loading...</div>;

  console.log("All recipes :", allRecipes1.result);
  return (
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
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Home
            </Link>
            <Link href="/recipes" className="text-orange-500 font-medium">
              All Recipes
            </Link>
            <Link
              href="/share-recipe"
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Share Recipe
            </Link>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search recipes, ingredients, or authors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-12 pr-4 py-3 text-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-48 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedDifficulty}
                onValueChange={(value) => {
                  setSelectedDifficulty(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-40 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-200 hover:bg-gray-50"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                More Filters
              </Button>

              {(searchTerm ||
                selectedCategory !== "All Categories" ||
                selectedDifficulty !== "All Levels" ||
                selectedTags.length > 0) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border border-gray-200 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Filter by Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <Label
                      htmlFor={tag}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {tag}
                    </Label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Active Filters */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500">Active tags:</span>
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          Showing {startIndex + 1}-
          {Math.min(
            startIndex + recipesPerPage,
            filteredAndSortedRecipes.length
          )}{" "}
          of {filteredAndSortedRecipes.length} recipes
        </div>

        {/* Recipe Grid/List */}
        {paginatedRecipes.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
                : "space-y-6 mb-8"
            }
          >
            {paginatedRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className={`group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm ${
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
                      <Link href={`/recipe/${recipe.id}`}>
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
              <Button
                onClick={clearFilters}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
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

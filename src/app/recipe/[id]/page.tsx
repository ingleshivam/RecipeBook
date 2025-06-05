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

async function getRecipe(id: string) {
  return {
    id,
    title: "Grandma's Chocolate Chip Cookies",
    description:
      "Soft, chewy, and loaded with chocolate chips. A family recipe passed down through generations that never fails to bring smiles and warm memories.",
    image: "/placeholder.svg?height=600&width=800",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      recipes: 23,
    },
    rating: 4.9,
    reviews: 127,
    prepTime: "15 min",
    cookTime: "10 min",
    totalTime: "25 min",
    servings: 24,
    difficulty: "Easy",
    category: "Desserts",
    tags: ["cookies", "chocolate", "family-recipe", "comfort-food"],
    ingredients: [
      { amount: "2¼ cups", item: "all-purpose flour" },
      { amount: "1 tsp", item: "baking soda" },
      { amount: "1 tsp", item: "salt" },
      { amount: "1 cup", item: "butter, softened" },
      { amount: "¾ cup", item: "granulated sugar" },
      { amount: "¾ cup", item: "packed brown sugar" },
      { amount: "2 large", item: "eggs" },
      { amount: "2 tsp", item: "vanilla extract" },
      { amount: "2 cups", item: "chocolate chips" },
      { amount: "1 cup", item: "chopped walnuts (optional)" },
    ],
    instructions: [
      "Preheat your oven to 375°F (190°C). Line baking sheets with parchment paper.",
      "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
      "In a large bowl, cream together the softened butter and both sugars until light and fluffy, about 3-4 minutes.",
      "Beat in eggs one at a time, then add vanilla extract.",
      "Gradually mix in the flour mixture until just combined. Don't overmix.",
      "Fold in chocolate chips and walnuts (if using).",
      "Drop rounded tablespoons of dough onto prepared baking sheets, spacing them 2 inches apart.",
      "Bake for 9-11 minutes, until edges are golden brown but centers still look slightly underbaked.",
      "Let cool on baking sheet for 5 minutes before transferring to a wire rack.",
      "Store in an airtight container for up to one week. Enjoy!",
    ],
    tips: [
      "Don't overbake - cookies will continue cooking on the hot pan after removal",
      "Room temperature ingredients mix better and create a more tender cookie",
      "Chill dough for 30 minutes for thicker cookies",
    ],
    nutrition: {
      calories: 180,
      fat: "8g",
      carbs: "26g",
      protein: "2g",
      sugar: "18g",
    },
  };
}

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

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
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.title}
                  width={800}
                  height={600}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{recipe.rating}</span>
                  <span className="text-gray-500">({recipe.reviews})</span>
                </div>
              </div>

              <div className="space-y-4">
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
                  {recipe.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-gray-600"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                  {recipe.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Author Info */}
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-orange-100">
                  <Image
                    src={recipe.author.avatar || "/placeholder.svg"}
                    alt={recipe.author.name}
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {recipe.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {recipe.author.recipes} recipes shared
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
                    <p className="font-semibold">{recipe.prepTime}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Cook Time</p>
                    <p className="font-semibold">{recipe.cookTime}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Servings</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                  <div className="text-center">
                    <Utensils className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Total Time</p>
                    <p className="font-semibold">{recipe.totalTime}</p>
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
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="font-medium text-orange-600 min-w-20">
                        {ingredient.amount}
                      </span>
                      <span className="text-gray-700">{ingredient.item}</span>
                    </li>
                  ))}
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
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 leading-relaxed pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Chef's Tips
                </h2>
                <ul className="space-y-3">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <ChefHat className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
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
                      {recipe.nutrition.calories}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fat</span>
                    <span className="font-medium">{recipe.nutrition.fat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carbs</span>
                    <span className="font-medium">
                      {recipe.nutrition.carbs}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protein</span>
                    <span className="font-medium">
                      {recipe.nutrition.protein}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sugar</span>
                    <span className="font-medium">
                      {recipe.nutrition.sugar}
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
                  More from {recipe.author.name}
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
                        <p className="text-sm text-gray-500">25 min • 4.8 ⭐</p>
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
  );
}

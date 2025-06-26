"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChefHat,
  Users,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import LoadingSpinner from "./LoadingSpinner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function RecipeLandingPage() {
  const router = useRouter();
  const { status } = useSession();
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
    <>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white ">
        {/* Hero Section */}
        <section className="relative py-10 px-5 md:py-20 md:px-30 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-green-100/30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight">
                    Share and Discover
                    <span className="text-orange-500 block">
                      Amazing Recipes
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Join our community of passionate home cooks. Share your
                    favorite recipes, discover new flavors, and connect with
                    fellow food enthusiasts from around the world.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg cursor-pointer"
                    onClick={() => router.push("/share-recipe")}
                  >
                    <ChefHat className="mr-2 h-5 w-5" />
                    Add Your Recipe
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg cursor-pointer"
                    onClick={() => router.push("/recipe")}
                  >
                    Explore Recipes
                  </Button>
                </div>
                <div className="flex items-center space-x-8 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>10,000+ Members</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="h-4 w-4" />
                    <span>50,000+ Recipes</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-green-200 rounded-3xl transform rotate-3"></div>
                <Image
                  src="https://dwylojmkbggcdvus.public.blob.vercel-storage.com/main-section-q8TnhyOJ2PWSr6PRfVfV57NWjWL46P.jpg?height=600&width=600"
                  alt="People cooking together in a warm kitchen"
                  width={600}
                  height={600}
                  className="relative rounded-3xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-10 px-5 md:py-20 lg:px-30 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Sharing your culinary creations is simple and rewarding
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                  <ChefHat className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  1. Submit Your Recipe
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Share your favorite recipe with detailed ingredients,
                  instructions, and photos. Our easy-to-use form makes it simple
                  to showcase your culinary creativity.
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  2. Admin Approval
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our team reviews each recipe to ensure quality and
                  authenticity. This helps maintain our high standards and keeps
                  our community safe.
                </p>
              </div>
              <div className="text-center group">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                  <Users className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  3. Everyone Enjoys
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Once approved, your recipe joins our collection for the
                  community to discover, try, and share with their friends and
                  family.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Recipes Section */}
        <section
          id="recipes"
          className="py-10 px-5 md:py-20 md:px-30 bg-gradient-to-b from-orange-50/50 to-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Featured Recipes
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover some of our community's most loved and highly-rated
                recipes
              </p>
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
                        <span className="text-sm font-medium">
                          {recipe.rating}
                        </span>
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
                          onClick={() =>
                            router.push(`/recipe/${recipe?.recipeId}`)
                          }
                        >
                          View Recipe
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 cursor-pointer"
                onClick={() => router.push("/recipe")}
              >
                View All Recipes
              </Button>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to Share Your Culinary Masterpiece?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of home cooks who are already sharing their
                favorite recipes. Your next favorite dish might be just one
                recipe away!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 text-lg cursor-pointer"
                  onClick={() => router.push("/share-recipe")}
                >
                  <ChefHat className="mr-2 h-5 w-5" />
                  Share Your Recipe
                </Button>
                {status === "unauthenticated" && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-orange-600 hover:bg-white/10 hover:text-white cursor-pointer px-8 py-4 text-lg"
                    onClick={() => router.push("/auth/signup")}
                  >
                    Create Account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 md:px-30 text-white py-16">
          <div className="container mx-auto px-4">
            {/* <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <ChefHat className="h-8 w-8 text-orange-500" />
                  <span className="text-2xl font-bold">RecipeShare</span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Bringing food lovers together through the joy of sharing
                  recipes and culinary experiences.
                </p>
                <div className="flex space-x-4">
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Browse Recipes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Popular Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Featured Chefs
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Recipe Collections
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Community</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Join Community
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Submit Recipe
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Recipe Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Success Stories
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}
            <div className=" text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Shivam Ingle. Built with ❤️
                using Next.js.{" "}
              </p>
            </div>
            <div className="flex space-x-4 mx-auto mt-5  w-fit">
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

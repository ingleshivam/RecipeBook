"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Plus,
  Minus,
  Upload,
  Clock,
  Users,
  X,
  ArrowLeft,
  Save,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ShareRecipePage() {
  const [ingredients, setIngredients] = useState([{ amount: "", item: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, { amount: "", item: "" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (
    index: number,
    field: "amount" | "item",
    value: string
  ) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((inst, i) => (i === index ? value : inst));
    setInstructions(updated);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    // Show success message or redirect
  };

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
              <Save className="h-4 w-4 mr-2" />
              Save Draft
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
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Share Your Recipe
            </h1>
            <p className="text-lg text-gray-600">
              Share your culinary creation with our community. Your recipe will
              be reviewed before being published.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Basic Information
                </CardTitle>
                <CardDescription>Tell us about your recipe</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-700">
                      Recipe Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g., Grandma's Chocolate Chip Cookies"
                      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-gray-700">
                      Category *
                    </Label>
                    <Select required>
                      <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appetizers">Appetizers</SelectItem>
                        <SelectItem value="main-course">Main Course</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your recipe, its origin, or what makes it special..."
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-24"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prepTime" className="text-gray-700">
                      Prep Time *
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="prepTime"
                        placeholder="15 min"
                        className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cookTime" className="text-gray-700">
                      Cook Time *
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cookTime"
                        placeholder="25 min"
                        className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings" className="text-gray-700">
                      Servings *
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="servings"
                        type="number"
                        placeholder="4"
                        className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-gray-700">
                      Difficulty *
                    </Label>
                    <Select required>
                      <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recipe Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Recipe Image
                </CardTitle>
                <CardDescription>
                  Upload a photo of your finished dish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  <Button type="button" variant="outline" className="mt-4">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Ingredients
                </CardTitle>
                <CardDescription>
                  List all ingredients with their amounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                      <Label className="text-gray-700">Amount</Label>
                      <Input
                        placeholder="1 cup"
                        value={ingredient.amount}
                        onChange={(e) =>
                          updateIngredient(index, "amount", e.target.value)
                        }
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="flex-[2] space-y-2">
                      <Label className="text-gray-700">Ingredient</Label>
                      <Input
                        placeholder="all-purpose flour"
                        value={ingredient.item}
                        onChange={(e) =>
                          updateIngredient(index, "item", e.target.value)
                        }
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      disabled={ingredients.length === 1}
                      className="mb-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Instructions
                </CardTitle>
                <CardDescription>
                  Step-by-step cooking instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold text-sm mt-2">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder={`Step ${
                          index + 1
                        }: Describe what to do...`}
                        value={instruction}
                        onChange={(e) =>
                          updateInstruction(index, e.target.value)
                        }
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-20"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeInstruction(index)}
                      disabled={instructions.length === 1}
                      className="mt-2"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addInstruction}
                  className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </CardContent>
            </Card>

            {/* Tags and Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">
                  Tags & Additional Info
                </CardTitle>
                <CardDescription>
                  Help others discover your recipe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-gray-700">Tags</Label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-orange-100 text-orange-700"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-orange-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., vegetarian, quick, comfort-food)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tips" className="text-gray-700">
                    Chef's Tips (Optional)
                  </Label>
                  <Textarea
                    id="tips"
                    placeholder="Share any helpful tips, substitutions, or variations..."
                    className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500 bg-orange-50 p-4 rounded-lg">
              <p className="font-medium mb-1">📝 Review Process</p>
              <p>
                Your recipe will be reviewed by our team within 24-48 hours.
                You'll receive an email notification once it's approved and
                published.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

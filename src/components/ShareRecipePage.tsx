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
import { useEffect, useState } from "react";
import z from "zod";
import { useForm, Controller } from "react-hook-form";
import { ISOFormatOptions } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useSWR from "swr";
import { BlobData } from "@/types/blobData";
import { useSession } from "next-auth/react";
import { del } from "@vercel/blob";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function ShareRecipePage() {
  const { data: sessionData } = useSession();
  console.log("Loggedin users data : ", sessionData);
  const RecipeSchema = z.object({
    category: z.string({ required_error: "Category is required" }),
    recipeTitle: z.string().min(1, "Recipe title is required"),
    recipeDescription: z
      .string()
      .min(1, "Recipe description is required")
      .min(100, "Recipe description should be at least 100 characters long.")
      .max(500, "Recipe description should not exceed 500 characters."),
    prepTime: z.string().min(1, "Prep time is required"),
    cookTime: z.string().min(1, "Cook time is required"),
    servings: z.string().min(1, "Number of servings is required"),
    difficulty: z.string({ required_error: "Difficulty is requied" }),
    recipeFile: z
      .instanceof(File, { message: "Recipe image is required" })
      .refine(
        (file) => file.size <= 2 * 1024 * 1024,
        "Image size must be less than 2MB"
      )
      .refine(
        (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
        "Only .jpeg. .jpg and .png files are supported"
      ),
    ingredients: z
      .array(
        z.object({
          amount: z.string().min(1, "Amount is required"),
          item: z.string().min(1, "Ingredient name is required"),
        })
      )
      .min(1, "At least one ingredient is required"),
    instructions: z
      .array(z.string().min(1, "Instruction is required"))
      .min(1, "At least one instruction is required"),
    tips: z.string().optional(),
    calorie: z.string().optional(),
    fat: z.string().optional(),
    carbs: z.string().optional(),
    protein: z.string().optional(),
    sugar: z.string().optional(),
    fiber: z.string().optional(),
  });

  type IRecipeSchema = z.infer<typeof RecipeSchema>;

  const {
    data: blobData,
    isLoading: isGettingBlobData,
    error: blobErrors,
  } = useSWR<BlobData>("/api/getBlobs", fetcher);

  const [ingredients, setIngredients] = useState([{ amount: "", item: "" }]);
  const [instructions, setInstructions] = useState([""]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  //   const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false);
  const [recipeFileName, setRecipeFileName] = useState("");
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    setValue("ingredients", ingredients);
    setValue("instructions", instructions);
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<IRecipeSchema>({
    resolver: zodResolver(RecipeSchema),
  });

  const watchedIngredients = watch("ingredients");
  const watchedInstructions = watch("instructions");

  const addIngredient = () => {
    const newIngredients = [...ingredients, { amount: "", item: "" }];
    setIngredients(newIngredients);
    setValue("ingredients", newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
      setValue("ingredients", newIngredients);
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
    setValue("ingredients", updated);
  };

  const addInstruction = () => {
    const newInstructions = [...instructions, ""];
    setInstructions(newInstructions);
    setValue("instructions", newInstructions);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = instructions.filter((_, i) => i !== index);
      setInstructions(newInstructions);
      setValue("instructions", newInstructions);
    }
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((inst, i) => (i === index ? value : inst));
    setInstructions(updated);
    setValue("instructions", updated);
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

  const onSubmit = async (values: IRecipeSchema) => {
    if (isGettingBlobData) {
      toast.warning("Please wait while we prepare the upload...");
      return;
    }
    console.log("blobData : ", blobData);
    console.log(
      "Blob data : ",
      blobData?.blobs.some((val) => val.pathname === values.recipeFile.name)
    );
    try {
      setIsSubmittingDraft(true);
      setIsSubmittingDraft(true);
      const formData = new FormData();
      formData.append("file", values.recipeFile);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      console.log("Upload Data : ", uploadData.message.url);
      if (!uploadResponse.ok) {
        toast.error("Error", {
          description: uploadData.message.error,
        });
        return;
      }
      const newValues = {
        ...values,
        tags: tags,
        userId: sessionData?.user.id,
        isDraft: isDraft,
        imageUrl: uploadData.message.url,
      };

      const response = await fetch("/api/addRecipe", {
        body: JSON.stringify(newValues),
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        await del(uploadData.message.url);
        toast.error("Error", {
          description: data.message.error,
        });
        return;
      }

      reset();
      setIngredients([{ amount: "", item: "" }]);
      setInstructions([""]);
      setTags([]);
      setNewTag("");
      setRecipeFileName("");
      setIsDraft(false);

      toast.success("Success", {
        description: data.message.success,
      });
    } catch (error) {
      toast.error("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsSubmittingDraft(false);
      setIsSubmittingDraft(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50 px-30">
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

      <div className="container mx-auto px-4 py-8 px-35">
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
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-6 gap-4">
              {/* Recipe Image */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Recipe Image
                  </CardTitle>
                  <CardDescription>
                    Upload a photo of your finished dish
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="recipeFile"
                    control={control}
                    render={({ field }) => (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p
                          className={`text-sm ${
                            recipeFileName ? "text-green-500" : "text-gray-500"
                          }`}
                        >
                          {recipeFileName
                            ? recipeFileName
                            : "PNG, JPG up to 10MB"}
                        </p>
                        <input
                          type="file"
                          id="image-upload"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            field.onChange(file);
                            setRecipeFileName(file?.name || "");
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                          className="mt-4"
                        >
                          Choose File
                        </Button>
                        <Label>
                          {errors?.recipeFile && (
                            <p className="w-full text-sm text-center  text-red-500 mt-1">
                              {errors.recipeFile.message}
                            </p>
                          )}
                        </Label>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
              {/* Basic Information */}
              <Card className="col-span-4">
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
                        Recipe Title <Label className=" text-red-500">*</Label>{" "}
                      </Label>
                      <Input
                        id="title"
                        {...register("recipeTitle")}
                        placeholder="e.g., Grandma's Chocolate Chip Cookies"
                        className="border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                      <Label>
                        {errors?.recipeTitle && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.recipeTitle.message}
                          </p>
                        )}
                      </Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-gray-700">
                        Category <Label className=" text-red-500">*</Label>
                      </Label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="border-gray-200 focus:border-orange-500 focus:ring-orange-500  w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Appetizers</SelectItem>
                              <SelectItem value="2">Main Course</SelectItem>
                              <SelectItem value="3">Desserts</SelectItem>
                              <SelectItem value="4">Beverages</SelectItem>
                              <SelectItem value="5">Snacks</SelectItem>
                              <SelectItem value="6">Breakfast</SelectItem>
                              <SelectItem value="7">Lunch</SelectItem>
                              <SelectItem value="8">Dinner</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Label>
                        {errors?.category && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.category.message}
                          </p>
                        )}
                      </Label>{" "}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700">
                      Description <Label className=" text-red-500">*</Label>
                    </Label>
                    <Textarea
                      id="description"
                      {...register("recipeDescription")}
                      placeholder="Describe your recipe, its origin, or what makes it special..."
                      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-24"
                    />
                    <Label>
                      {errors?.recipeDescription && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.recipeDescription.message}
                        </p>
                      )}
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prepTime" className="text-gray-700">
                        Prep Time <Label className=" text-red-500">*</Label>
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="prepTime"
                          {...register("prepTime")}
                          placeholder="15 min"
                          className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        />
                        <Label>
                          {errors?.prepTime && (
                            <p className="text-sm text-red-500 mt-3">
                              {errors.prepTime.message}
                            </p>
                          )}
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cookTime" className="text-gray-700">
                        Cook Time <Label className=" text-red-500">*</Label>
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="cookTime"
                          {...register("cookTime")}
                          placeholder="25 min"
                          className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        />
                        <Label>
                          {errors?.cookTime && (
                            <p className="text-sm text-red-500 mt-3">
                              {errors.cookTime.message}
                            </p>
                          )}
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="servings" className="text-gray-700">
                        Servings <Label className=" text-red-500">*</Label>
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="servings"
                          {...register("servings")}
                          type="number"
                          placeholder="4"
                          className="pl-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                        />
                        <Label>
                          {errors?.servings && (
                            <p className="text-sm text-red-500 mt-3">
                              {errors.servings.message}
                            </p>
                          )}
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-gray-700">
                        Difficulty <Label className=" text-red-500">*</Label>
                      </Label>
                      <Controller
                        name="difficulty"
                        control={control}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="w-full border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                              <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Easy</SelectItem>
                              <SelectItem value="2">Medium</SelectItem>
                              <SelectItem value="3">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Label>
                        {errors?.difficulty && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.difficulty.message}
                          </p>
                        )}
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {/* Ingredients */}
              <Card className="col-span-2">
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
                        <Label>
                          {errors.ingredients?.[index]?.amount && (
                            <p className="text-sm text-red-500">
                              {errors.ingredients[index]?.amount?.message}
                            </p>
                          )}
                        </Label>
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
                        <Label>
                          {errors.ingredients?.[index]?.item && (
                            <p className="text-sm text-red-500">
                              {errors.ingredients[index]?.item?.message}
                            </p>
                          )}
                        </Label>
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
                  <Label>
                    {errors.ingredients &&
                      !Array.isArray(errors.ingredients) && (
                        <p className="text-sm text-red-500">
                          {errors.ingredients.message}
                        </p>
                      )}
                  </Label>
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
              <Card className="col-span-4">
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
                        <Label>
                          {errors.instructions?.[index] && (
                            <p className="text-sm text-red-500">
                              {errors.instructions[index]?.message}
                            </p>
                          )}
                        </Label>
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
                  <Label>
                    {errors.instructions &&
                      !Array.isArray(errors.instructions) && (
                        <p className="text-sm text-red-500">
                          {errors.instructions.message}
                        </p>
                      )}
                  </Label>
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
            </div>
            <div className="grid grid-cols-6 gap-4">
              {/* Nutrition Information */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Nutrition Information
                  </CardTitle>
                  <CardDescription>
                    Help others make informed food choices.{" "}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-gray-700">Calories</Label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input placeholder="180" {...register("calorie")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Fat</Label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input placeholder="8gm" {...register("fat")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Carbs</Label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input placeholder="26gm" {...register("carbs")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Protein</Label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input placeholder="2gm" {...register("protein")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Sugar</Label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input placeholder="18gm" {...register("sugar")} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700">Fiber</Label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                        <Input placeholder="3gm" {...register("fiber")} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Tags and Additional Info */}
              <Card className="col-span-4">
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
                      {...register("tips")}
                      placeholder="Share any helpful tips, substitutions, or variations..."
                      className="border-gray-200 focus:border-orange-500 focus:ring-orange-500 min-h-24"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
                disabled={isSubmittingDraft || isSubmittingReview}
              >
                {isSubmittingDraft ? (
                  "Submitting..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </>
                )}
              </Button>
              <Button
                type="submit"
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmittingReview || isSubmittingDraft}
              >
                {isSubmittingReview ? (
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

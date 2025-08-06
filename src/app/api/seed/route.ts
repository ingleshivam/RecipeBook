// /app/api/seed-recipes/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const recipes = [
      {
        title: "Grandma’s Chocolate Chip Cookies",
        description: "Chewy and nostalgic cookies with chocolate chips.",
        prepTime: 15,
        cookingTime: 10,
        servingSize: 4,
        difficulty: 1,
        categoryId: 1,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "All-purpose flour", amount: "1 cup" },
          { item: "Butter", amount: "1/2 cup" },
          { item: "Sugar", amount: "3/4 cup" },
        ],
        instructions: [
          "Mix the dry ingredients.",
          "Add butter and mix well.",
          "Bake at 180°C for 10 minutes.",
        ],
        nutritionInfo: {
          calorie: "180",
          fat: "8",
          carbs: "26",
          protein: "2",
          sugar: "18",
          fiber: "3",
        },
        tags: ["dessert", "cookies", "baking"],
      },
      {
        title: "Mediterranean Chickpea Salad",
        description: "Protein-rich salad with bold Mediterranean flavors.",
        prepTime: 10,
        cookingTime: 0,
        servingSize: 2,
        difficulty: 1,
        categoryId: 2,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Chickpeas", amount: "1 can" },
          { item: "Tomato", amount: "1" },
          { item: "Cucumber", amount: "1" },
        ],
        instructions: [
          "Chop vegetables and toss with chickpeas.",
          "Drizzle with lemon and olive oil.",
        ],
        nutritionInfo: {
          calorie: "200",
          fat: "9",
          carbs: "22",
          protein: "7",
          sugar: "3",
          fiber: "1",
        },
        tags: ["vegetarian", "salad", "healthy"],
      },
      {
        title: "Creamy Garlic Mushroom Pasta",
        description: "Rich and creamy pasta with sautéed garlic mushrooms.",
        prepTime: 10,
        cookingTime: 20,
        servingSize: 2,
        difficulty: 2,
        categoryId: 3,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Spaghetti", amount: "200g" },
          { item: "Mushrooms", amount: "200g" },
          { item: "Garlic", amount: "3 cloves" },
        ],
        instructions: [
          "Boil pasta until al dente.",
          "Sauté garlic and mushrooms in butter.",
          "Add cream and combine with pasta.",
        ],
        nutritionInfo: {
          calorie: "520",
          fat: "18",
          carbs: "65",
          protein: "14",
          sugar: "5",
          fiber: "9",
        },
        tags: ["vegetarian", "pasta", "comfort-food"],
      },
      {
        title: "Spicy Grilled Chicken Tikka",
        description: "Juicy chicken marinated in Indian spices and grilled.",
        prepTime: 20,
        cookingTime: 25,
        servingSize: 3,
        difficulty: 2,
        categoryId: 4,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Chicken", amount: "500g" },
          { item: "Yogurt", amount: "1/2 cup" },
          { item: "Garam masala", amount: "1 tsp" },
        ],
        instructions: [
          "Marinate chicken with spices and yogurt.",
          "Grill until fully cooked.",
        ],
        nutritionInfo: {
          calorie: "300",
          fat: "10",
          carbs: "5",
          protein: "40",
          sugar: "1",
          fiber: "3",
        },
        tags: ["spicy", "grilled", "highprotein"],
      },
      {
        title: "Fluffy Banana Pancakes",
        description: "Soft and sweet pancakes made with ripe bananas.",
        prepTime: 10,
        cookingTime: 15,
        servingSize: 2,
        difficulty: 1,
        categoryId: 5,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Banana", amount: "1" },
          { item: "Flour", amount: "1 cup" },
          { item: "Milk", amount: "3/4 cup" },
        ],
        instructions: [
          "Mash banana and mix with wet ingredients.",
          "Add flour and mix.",
          "Cook on pan until golden brown.",
        ],
        nutritionInfo: {
          calorie: "350",
          fat: "9",
          carbs: "60",
          protein: "8",
          sugar: "12",
          fiber: "3",
        },
        tags: ["breakfast", "pancakes", "kids"],
      },
      {
        title: "Vegetable Ramen Bowl",
        description: "Quick and cozy noodle bowl full of vegetables.",
        prepTime: 10,
        cookingTime: 15,
        servingSize: 2,
        difficulty: 1,
        categoryId: 6,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Ramen noodles", amount: "1 pack" },
          { item: "Spinach", amount: "1/2 cup" },
          { item: "Mushrooms", amount: "1/2 cup" },
        ],
        instructions: [
          "Boil broth with seasonings.",
          "Add vegetables and noodles.",
        ],
        nutritionInfo: {
          calorie: "400",
          fat: "12",
          carbs: "55",
          protein: "10",
          sugar: "3",
          fiber: "2",
        },
        tags: ["vegan", "noodles", "asian"],
      },
      {
        title: "One-Pot Lentil Curry",
        description: "Hearty, protein-rich curry made with red lentils.",
        prepTime: 10,
        cookingTime: 25,
        servingSize: 4,
        difficulty: 2,
        categoryId: 7,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Red lentils", amount: "1 cup" },
          { item: "Tomatoes", amount: "2" },
          { item: "Onion", amount: "1" },
        ],
        instructions: [
          "Sauté onion, garlic, and spices.",
          "Add lentils and simmer until soft.",
        ],
        nutritionInfo: {
          calorie: "250",
          fat: "5",
          carbs: "35",
          protein: "12",
          sugar: "4",
          fiber: "1",
        },
        tags: ["vegan", "indian", "healthy"],
      },
      {
        title: "No-Churn Mango Ice Cream",
        description: "Tropical frozen dessert without an ice cream maker.",
        prepTime: 10,
        cookingTime: 360,
        servingSize: 4,
        difficulty: 1,
        categoryId: 8,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Mango pulp", amount: "2 cups" },
          { item: "Condensed milk", amount: "1 cup" },
          { item: "Whipped cream", amount: "1 cup" },
        ],
        instructions: [
          "Blend all ingredients until smooth.",
          "Freeze for 6+ hours.",
        ],
        nutritionInfo: {
          calorie: "220",
          fat: "10",
          carbs: "28",
          protein: "3",
          sugar: "22",
          fiber: "2",
        },
        tags: ["dessert", "summer", "icecream"],
      },
      {
        title: "Classic Margherita Pizza",
        description:
          "Simple and fresh pizza with tomato, mozzarella, and basil.",
        prepTime: 20,
        cookingTime: 15,
        servingSize: 2,
        difficulty: 2,
        categoryId: 9,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Pizza dough", amount: "1 base" },
          { item: "Tomato sauce", amount: "1/2 cup" },
          { item: "Mozzarella", amount: "1 cup" },
        ],
        instructions: [
          "Spread sauce on base.",
          "Top with cheese and bake until golden.",
        ],
        nutritionInfo: {
          calorie: "450",
          fat: "18",
          carbs: "55",
          protein: "14",
          sugar: "6",
          fiber: "4",
        },
        tags: ["vegetarian", "pizza", "italian"],
      },
      {
        title: "Egg Fried Rice",
        description: "Quick and satisfying fried rice with scrambled eggs.",
        prepTime: 10,
        cookingTime: 15,
        servingSize: 2,
        difficulty: 1,
        categoryId: 10,
        imageUrl: "/recipesImages/fallback_image.png",
        ingredients: [
          { item: "Cooked rice", amount: "2 cups" },
          { item: "Eggs", amount: "2" },
          { item: "Soy sauce", amount: "2 tbsp" },
        ],
        instructions: [
          "Scramble eggs and set aside.",
          "Fry rice with soy sauce and mix in eggs.",
        ],
        nutritionInfo: {
          calorie: "380",
          fat: "10",
          carbs: "50",
          protein: "10",
          sugar: "2",
          fiber: "2",
        },
        tags: ["quick", "asian", "eggs"],
      },
    ];

    for (const recipe of recipes) {
      const ingredientEntries = await Promise.all(
        recipe.ingredients.map(async (val: any) => {
          const existingIngredient = await prisma.ingredient.findUnique({
            where: { name: val.item },
          });
          return {
            quantity: val.amount,
            ingredient: existingIngredient
              ? { connect: { ingredientId: existingIngredient.ingredientId } }
              : { create: { name: val.item } },
          };
        })
      );

      const tagEntries = await Promise.all(
        recipe.tags.map(async (val: string) => {
          const existingTag = await prisma.tag.findUnique({
            where: { name: val },
          });
          return existingTag
            ? { tag: { connect: { tagId: existingTag.tagId } } }
            : { tag: { create: { name: val } } };
        })
      );

      await prisma.recipe.create({
        data: {
          title: recipe.title,
          description: recipe.description,
          cookingTime: recipe.cookingTime,
          servingSize: recipe.servingSize,
          categoryId: recipe.categoryId,
          prepTime: recipe.prepTime,
          difficulty: recipe.difficulty,
          userId: 20,
          approveStatus: "A",
          isSavedAsDraft: 0,
          images: {
            create: {
              imageUrl: recipe.imageUrl,
              description: "Seed image",
            },
          },
          ingredients: {
            create: ingredientEntries,
          },
          instructions: {
            create: recipe.instructions.map((inst: string) => ({
              instruction: { create: { description: inst } },
            })),
          },
          nutritionInfo: {
            create: {
              nutritionInfo: {
                create: recipe.nutritionInfo,
              },
            },
          },
          tags: {
            create: tagEntries,
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Seeding completed successfully." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to seed data." },
      { status: 500 }
    );
  }
}

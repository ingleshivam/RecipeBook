import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Data : ", data);

    const ingredientPromises = data.ingredients.map(async (val: any) => {
      const existingIngredient = await prisma.ingredient.findUnique({
        where: {
          name: val.item,
        },
      });

      return {
        quantity: val.amount,
        ingredient: existingIngredient
          ? { connect: { ingredientId: existingIngredient.ingredientId } }
          : { create: { name: val.item } },
      };
    });

    const tagPromises = data.tags.map(async (val: any) => {
      const existingTag = await prisma.tag.findUnique({
        where: {
          name: val,
        },
      });

      return existingTag
        ? { tag: { connect: { tagId: existingTag.tagId } } }
        : { tag: { create: { name: val } } };
    });

    const [processedIngredients, processedTags] = await Promise.all([
      Promise.all(ingredientPromises),
      Promise.all(tagPromises),
    ]);

    const response = await prisma.recipe.create({
      data: {
        title: data.recipeTitle,
        description: data.recipeDescription,
        cookingTime: parseInt(data.cookTime),
        servingSize: parseInt(data.servings),
        categoryId: parseInt(data.category),
        prepTime: parseInt(data.prepTime),
        difficulty: parseInt(data.difficulty),
        userId: parseInt(data.userId),
        approveStatus: data.isDraft ? "D" : "U",
        isSavedAsDraft: data.isDraft ? 1 : 0,
        images: {
          create: {
            imageUrl: data.imageUrl,
            description: "NA",
          },
        },
        ingredients: {
          create: processedIngredients,
        },
        instructions: {
          create: data.instructions.map((ing: any) => ({
            instruction: {
              create: {
                description: ing,
              },
            },
          })),
        },
        nutritionInfo: {
          create: {
            nutritionInfo: {
              create: {
                calorie: data.calorie,
                fat: data.fat,
                carbs: data.carbs,
                protein: data.protein,
                sugar: data.sugar,
                fiber: data.fiber,
              },
            },
          },
        },
        tags: {
          create: processedTags,
        },
      },
    });
    return NextResponse.json(
      { message: { success: "Data is stored successfully !", error: "" } },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error :", error);
      return NextResponse.json(
        { message: { success: "", error: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: { success: "", error: "Internal server error !" } },
      { status: 500 }
    );
  }
}

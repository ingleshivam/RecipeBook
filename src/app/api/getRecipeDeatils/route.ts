import { NextResponse } from "next/server";
import { category, difficulty } from "@/data/dropdownData";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const response = await prisma?.recipe.findMany({
      include: {
        user: true,
        images: true,
        tags: true,

        ingredients: {
          include: {
            ingredient: true,
          },
        },
        instructions: {
          include: {
            instruction: true,
          },
          orderBy: {
            instructionId: "desc",
          },
        },
        nutritionInfo: {
          include: {
            nutritionInfo: true,
          },
        },
      },
    });
    console.log("Response :", response);
    let result;
    if (response && response?.length > 0) {
      result = response.map((item) => ({
        recipeId: item.recipeId,
        title: item.title,
        description: item.description,
        image: item.images[0].imageUrl,
        author: item.user?.firstName + " " + item.user?.lastName,
        // rating: 4.9,
        // reviews: 127,
        approveStatus: item.approveStatus,
        approvedDate: item.approvedDate,
        prepTime: item.prepTime,
        cookTime: item.cookingTime,
        totalTime:
          item.prepTime && item.cookingTime
            ? item.prepTime + item.cookingTime
            : 0,
        servings: item.servingSize,
        difficulty: difficulty.find(
          (val: any) => parseInt(val.value) === item.difficulty
        )?.value,
        category: category.find(
          (val: any) => parseInt(val.value) === item.categoryId
        )?.value,
        tags: item.tags,
        createdAt: item.createdAt,
        user: item.user,
        instructions: item.instructions,
        nutritionInfo: item.nutritionInfo,
        ingredients: item.ingredients,
      }));
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: { error: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: { error: "Internal server error" } },
      { status: 500 }
    );
  }
}

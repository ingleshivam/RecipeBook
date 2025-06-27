import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { category, difficulty } from "@/data/dropdownData";

export async function POST(request: NextRequest) {
  const { recipeId } = await request.json();
  const token = await getToken({ req: request });
  try {
    const existingRecipeRecord = await prisma?.favorite.findUnique({
      where: {
        userId_recipeId: {
          recipeId: recipeId,
          userId: parseInt((token as any)?.id),
        },
      },
    });

    let isFavourite = 1;
    if (existingRecipeRecord) {
      isFavourite = existingRecipeRecord.isFavourite === 1 ? 0 : 1;
    }

    const result = await prisma?.favorite.upsert({
      where: {
        userId_recipeId: {
          recipeId: recipeId,
          userId: Number(token?.id),
        },
      },
      update: {
        isFavourite: isFavourite,
      },
      create: {
        recipeId: recipeId,
        userId: parseInt((token as any)?.id),
        isFavourite: isFavourite,
      },
    });

    if (result.isFavourite === 1) {
      return NextResponse.json(
        { message: "Recipe favourited successfully !" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Recipe Unfavourited successfully !" },
        { status: 200 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to favourite recipe !" },
        { status: 400 }
      );
    }
  }
}

export async function GET(request: Request) {
  try {
    const response = await prisma?.recipe.findMany({
      where: {
        favorites: {
          some: {
            isFavourite: 1,
          },
        },
      },
      include: {
        user: true,
        images: true,
        tags: true,
        favorites: {
          where: {
            isFavourite: 1,
          },
          select: {
            isFavourite: true,
          },
        },
      },
    });
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
        favourite: item.favorites,
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

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

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

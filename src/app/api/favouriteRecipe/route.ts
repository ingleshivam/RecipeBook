import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  const token = await getToken({ req: request });
  console.log("Recipe id : ", id);
  try {
    const existingRecipeRecord = await prisma?.favorite.findUnique({
      where: {
        userId_recipeId: {
          recipeId: id,
          userId: parseInt((token as any)?.id),
        },
      },
    });

    console.log("existingRecipeRecord : ", existingRecipeRecord);

    let isFavourite = 0;
    if (existingRecipeRecord) {
      isFavourite = existingRecipeRecord.isFavourite === 1 ? 0 : 1;
    }

    const result = await prisma?.favorite.upsert({
      where: {
        userId_recipeId: {
          recipeId: id,
          userId: Number(token?.id),
        },
      },
      update: {
        isFavourite: isFavourite,
      },
      create: {
        recipeId: id,
        userId: parseInt((token as any)?.id),
      },
    });

    return NextResponse.json(
      { message: "Recipe favourited successfully !" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log("error : ", error);
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

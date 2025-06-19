import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { recipeId } = await request.json();
  console.log("Recipe Id : ", recipeId);
  const session = await getSession();
  try {
    const result = await prisma?.favorite.create({
      data: {
        recipeId: recipeId,
        userId: Number(session?.user?.id),
      },
    });

    return NextResponse.json(
      { message: "Recipe favourited successfully !" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }
}

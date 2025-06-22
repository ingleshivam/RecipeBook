import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const { recipeId } = await request.json();
  const token = await getToken({ req: request });
  console.log("Recipe Id : ", recipeId);
  try {
    const result = await prisma?.favorite.create({
      data: {
        recipeId: recipeId,
        userId: Number(token?.id),
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

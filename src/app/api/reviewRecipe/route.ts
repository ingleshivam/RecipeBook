import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  const { recipeId, rating, reviewText } = await request.json();
  const token = await getToken({ req: request });

  const existingRecipeRecord = await prisma?.review.findFirst({
    where: {
      recipeId: recipeId,
      userId: parseInt((token as any)?.id),
    },
  });

  console.log("Existing record : ", existingRecipeRecord);

  if (existingRecipeRecord) {
    try {
      const result = await prisma?.review.update({
        where: {
          reviewId: existingRecipeRecord.reviewId,
        },
        data: {
          rating: rating,
          reviewText: reviewText,
        },
      });
      return NextResponse.json(
        { message: "Review updated successfully !" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Review updation failed !" },
        { status: 400 }
      );
    }
  }

  try {
    const result = await prisma?.review.create({
      data: {
        recipeId: recipeId,
        userId: parseInt((token as any)?.id),
        rating: rating,
        reviewText: reviewText,
      },
    });

    return NextResponse.json(
      { message: "Review submitted successfully !" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Review submission failed !" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = request.url;
  const { searchParams } = new URL(url);
  const recipeId = searchParams.get("recipeId");

  try {
    const result = await prisma?.review.findMany({
      where: {
        recipeId: Number(recipeId),
      },
      include: {
        user: true,
      },
    });
    return NextResponse.json(
      { message: "Review details fetched successfully !", data: result },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch review details" },
      { status: 400 }
    );
  }
}

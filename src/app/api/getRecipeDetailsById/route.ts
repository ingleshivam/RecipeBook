import { NextResponse, NextRequest } from "next/server";
import { category, difficulty } from "@/data/dropdownData";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.url;
  const { searchParams } = new URL(url);
  const id = searchParams.get("id");
  try {
    const response = (await prisma?.recipe.findUnique({
      where: {
        recipeId: Number(id),
      },

      include: {
        images: true,
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
        tags: {
          include: {
            tag: true,
          },
        },
        user: true,
        favorites: {
          where: {
            recipeId: Number(id),
            userId: parseInt((token as any)?.id) || -1,
          },
          select: {
            isFavourite: true,
          },
        },
        reviews: {
          where: {
            recipeId: Number(id),
          },
        },
      },
    })) as any;

    const recipeCount = await prisma?.recipe.aggregate({
      where: {
        userId: response?.user?.userId,
      },
      _count: {
        recipeId: true,
      },
    });

    const reviewCount = await prisma?.review.aggregate({
      where: {
        recipeId: Number(id),
      },
      _count: {
        recipeId: true,
      },
    });

    // Calculate average rating from reviews
    const ratings =
      response?.reviews?.map((review: any) => review.rating) || [];

    console.log("Rating : ", ratings);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
          ratings.length
        : 0;

    console.log("Average Rating :", averageRating);

    const allRecipesByUseId = (await prisma?.recipe.findMany({
      where: {
        userId: response?.user?.userId,
        approveStatus: "A",
        NOT: {
          recipeId: Number(id),
        },
      },
      include: {
        images: true,
      },
    })) as any;

    const count = recipeCount?._count;
    const totalReviewCount = reviewCount?._count;

    let result;
    if (response) {
      result = {
        recipeId: response.recipeId,
        title: response.title,
        description: response.description,
        image: response.images?.[0]?.imageUrl,
        author: response.user?.firstName + " " + response.user?.lastName,
        rating: parseFloat(averageRating.toFixed(1)),
        reviews: ratings.length,
        prepTime: response.prepTime,
        cookTime: response.cookingTime,
        totalTime:
          response.prepTime && response.cookingTime
            ? response.prepTime + response.cookingTime
            : 0,
        servings: response.servingSize,
        difficulty: difficulty.find(
          (val: any) => parseInt(val.value) === response.difficulty
        )?.diffuculty,
        category: category.find(
          (val: any) => parseInt(val.value) === response.categoryId
        )?.category_name,
        tags: response.tags,
        instructions: response.instructions,
        ingredients: response.ingredients,
        nutritionInfo: response.nutritionInfo,
        createdAt: response.createdAt,
        favourite: response.favorites,
        totalReviewCount: totalReviewCount,
        reviewRating: parseFloat(averageRating.toFixed(1)),
      };
    }

    return NextResponse.json(
      { result, count, allRecipesByUseId },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: { error: error.message } },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: { error: "Internal server error !" } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { recipeId, status } = await request.json();
    const response = await prisma.recipe.update({
      where: { recipeId: recipeId },
      data: { approveStatus: status },
      include: {
        images: true,
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
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    return NextResponse.json(
      {
        message: `Profile ${
          status == "A" ? "Approved" : "Rajected"
        }  Successfully !`,
        response,
      },
      {
        status: 200,
        statusText: `Profile ${
          status == "A" ? "Approved" : "Rajected"
        }  Successfully !`,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal server error !" },
      {
        status: 500,
      }
    );
  }
}

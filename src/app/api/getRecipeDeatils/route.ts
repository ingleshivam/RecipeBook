import { NextRequest, NextResponse } from "next/server";
import { category, difficulty } from "@/data/dropdownData";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  const url = request.url;
  const { searchParams } = new URL(url);
  const type = searchParams.get("type");
  const token = await getToken({ req: request });

  try {
    let response;
    if (type === "featuredSection") {
      response = (await prisma?.recipe.findMany({
        where: {
          approveStatus: "A",
        },
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
          favorites: {
            where: {
              isFavourite: 1,
              userId: parseInt((token as any)?.id) || -1,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      })) as any;
    } else {
      response = (await prisma?.recipe.findMany({
        where: {
          approveStatus: "A",
        },
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
          favorites: {
            where: {
              isFavourite: 1,
              userId: parseInt((token as any)?.id) || -1,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
        },
      })) as any;
    }

    let result;
    if (response && response?.length > 0) {
      result = response.map((item: any) => {
        // Calculate average rating from reviews
        const ratings = item.reviews?.map((review: any) => review.rating) || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
              ratings.length
            : 0;

        return {
          recipeId: item.recipeId,
          title: item.title,
          description: item.description,
          image: item.images?.[0]?.imageUrl,
          author: item.user?.firstName + " " + item.user?.lastName,
          rating: parseFloat(averageRating.toFixed(1)),
          reviews: ratings.length,
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
          favourite: item.favorites,
        };
      });
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

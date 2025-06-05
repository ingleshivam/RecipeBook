import { NextResponse } from "next/server";
import { truncateByDomain } from "recharts/types/util/ChartUtils";

export async function GET(request: Request) {
  try {
    const response = await prisma?.recipe.findMany({
      include: {
        user: true,
        images: true,
        tags: true,
        instructions: true,
        nutritionInfo: true,
        ingredients: true,
      },
    });

    let result;
    if (response && response?.length > 0) {
      result = response.map((item) => ({
        title: item.title,
        description: item.description,
        image: item.images[0].imageUrl,
        author: item.user?.firstName + " " + item.user?.lastName,
        // rating: 4.9,
        // reviews: 127,
        prepTime: item.prepTime,
        cookTime: item.cookingTime,
        totalTime:
          item.prepTime && item.cookingTime
            ? item.prepTime + item.cookingTime
            : 0,
        servings: item.servingSize,
        difficulty: item.difficulty,
        category: item.difficulty,
        tags: item.tags,
        createdAt: item.createdAt,
      }));
    }

    console.log("Response from api : ", result);
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

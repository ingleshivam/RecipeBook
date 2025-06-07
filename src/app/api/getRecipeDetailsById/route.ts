import { NextResponse } from "next/server";
import { category, difficulty } from "@/data/dropdownData";

export async function GET(request: Request) {
  const url = request.url;
  const { searchParams } = new URL(url);
  const id = searchParams.get("id");
  try {
    const response = await prisma?.recipe.findUnique({
      where: {
        recipeId: Number(id),
      },

      include: {
        images: true,
        ingredients: true,
        instructions: true,
        nutritionInfo: true,
        tags: true,
        user: true,
      },
    });

    let result;
    if (response) {
      result = {
        recipeId: response.recipeId,
        title: response.title,
        description: response.description,
        image: response.images[0].imageUrl,
        author: response.user?.firstName + " " + response.user?.lastName,

        // rating: 4.9,
        // reviews: 127,
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
        nutritionInfor: response.nutritionInfo,
        createdAt: response.createdAt,
      };
    }

    console.log("Get recipe details by id : ", result);

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: { error: error.message } },
        { status: 400, statusText: error.message }
      );
    }
    return NextResponse.json(
      { message: { error: "Internal server error !" } },
      { status: 500, statusText: "Internal server error !" }
    );
  }
}

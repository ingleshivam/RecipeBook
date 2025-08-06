import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { AI_DATA } = await req.json();

  const prompt = `
    You are a helpful assistant that extracts relevant tags from recipe data. 

    Given the full recipe (title, ingredients, instructions, and nutrition), return a JSON array of concise, lowercase tags that describe the recipe.

    Tags should include:
    - Main ingredients (e.g. chicken, tofu, lentils, spinach)
    - Dietary categories (e.g. vegetarian, vegan, gluten-free, keto, dairy-free)
    - Nutritional info (e.g. high protein, low carb, low calorie)
    - Cuisine type (e.g. Indian, Italian, Chinese, Mexican)
    - Meal type (e.g. breakfast, lunch, dinner, dessert, snack)
    - Cooking attributes (e.g. quick, easy, under 20 minutes, one-pot)

    Only include relevant tags. Do NOT generate duplicates. All tags must be in lowercase.
    Only return the array of tags. Do NOT include the paragraphs or leading or trailing phrases.
    ### Example Input:

    Title: Tofu Stir-Fry  
    Ingredients: tofu, broccoli, bell peppers, soy sauce, garlic  
    Instructions: Stir-fry all vegetables and tofu in a hot pan for 10 minutes.  
    Nutrition: 18g protein, 260 kcal per serving.

    ### Example Tags:
    ["tofu", "broccoli", "quick", "high protein", "vegan", "asian", "dinner", "low calorie"]

    ---

    Now generate tags for the following recipe:

    {{AI_DATA}}

    Tags:

  `;

  const groq = new Groq();

  const response = await groq.chat.completions.create({
    model: process.env.GENERATE_TAGS_GROQ_MODEL as string,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: JSON.stringify(AI_DATA),
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "recipeTags",
        schema: {
          type: "object",
          properties: {
            tags: { type: "array" },
            key_features: {
              type: "array",
              items: { type: "string" },
            },
          },
          additionalProperties: false,
        },
      },
    },
  });
  const result = JSON.parse(response.choices[0].message.content || "{}");

  return NextResponse.json({ result }, { status: 200 });
}

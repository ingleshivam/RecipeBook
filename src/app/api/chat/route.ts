import { NextRequest } from "next/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { data } = await req.json();

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

    ### Example Input:

    Title: Tofu Stir-Fry  
    Ingredients: tofu, broccoli, bell peppers, soy sauce, garlic  
    Instructions: Stir-fry all vegetables and tofu in a hot pan for 10 minutes.  
    Nutrition: 18g protein, 260 kcal per serving.

    ### Example Tags:
    ["tofu", "broccoli", "quick", "high protein", "vegan", "asian", "dinner", "low calorie"]

    ---

    Now generate tags for the following recipe:

    {{recipe_data}}

    Tags:

  `;

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: "What is your name ?",
  });

  console.log("Returned Text : ", text);
}

/**
 * Recipe Chatbot with Advanced Reranking System
 *
 * This module implements a sophisticated recipe recommendation system that combines:
 * 1. Vector similarity search using Qdrant
 * 2. LLM-based reranking for improved accuracy
 * 3. Fallback keyword-based reranking for reliability
 * 4. Intelligent caching for performance optimization
 *
 * The reranking system evaluates recipes based on:
 * - Ingredient matches (0-3 points)
 * - Dietary requirements alignment (0-2 points)
 * - Cooking time and difficulty match (0-2 points)
 * - Cuisine type relevance (0-1 point)
 * - Meal type appropriateness (0-1 point)
 * - Overall query alignment (0-1 point)
 */

"use server";
import {
  createStatefulMiddleware,
  createWorkflow,
  workflowEvent,
} from "@llamaindex/workflow";
import { Groq, groq } from "@llamaindex/groq";
import { getRecipeFromQdrant } from "../qdrant";
import { Settings, VectorStoreIndex } from "llamaindex";
import { QdrantVectorStore } from "@llamaindex/qdrant";
import { initSettings } from "../initSettings";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";
import { HuggingFaceAPIEmbedding } from "@/lib/embedModel";

// Simple in-memory cache for recipe details
const recipeCache = new Map<number, any>();

// Cache management - clear cache every 30 minutes to prevent memory issues
let lastCacheClear = Date.now();
const CACHE_CLEAR_INTERVAL = 30 * 60 * 1000; // 30 minutes

function clearCacheIfNeeded() {
  const now = Date.now();
  if (now - lastCacheClear > CACHE_CLEAR_INTERVAL) {
    recipeCache.clear();
    lastCacheClear = now;
    console.log("Recipe cache cleared");
  }
}

// const llm = groq({
//   model: process.env.GENERATE_TAGS_GROQ_MODEL!,
//   apiKey: process.env.GROQ_API_KEY!,
// });

// const interpretQuestionEvent = workflowEvent<string>();
// const returnTagsEvent = workflowEvent<{
//   tags: string[];
//   originalQuestion: string;
// }>();
// const getRecipeFromQdrantEvent = workflowEvent<{
//   response: any;
// }>();
// const refineResponseEvent = workflowEvent<{ refinedTags: string[] }>();

// const { withState, getContext } = createStatefulMiddleware(() => ({
//   numIterations: 0,
//   maxIterations: 4,
// }));

// const workflow = withState(createWorkflow());

// workflow.handle([interpretQuestionEvent], async (event) => {
//   const prompt = `
//     You are a helpful assistant that extracts relevant tags from user question.
//     Given the users question, return a JSON array of concise, lowercase tags that describe the recipe.
//     Tags should include:
//     - Main ingredients (e.g. chicken, tofu, lentils, spinach)
//     - Dietary categories (e.g. vegetarian, vegan, gluten-free, keto, dairy-free)
//     - Nutritional info (e.g. high protein, low carb, low calorie)
//     - Cuisine type (e.g. Indian, Italian, Chinese, Mexican)
//     - Meal type (e.g. breakfast, lunch, dinner, dessert, snack)
//     - Cooking attributes (e.g. quick, easy, under 20 minutes, one-pot)

//     Only include relevant tags. Do NOT generate duplicates. All tags must be in lowercase.
//     Only return the array of tags. Do NOT include the paragraphs or leading or trailing phrases.

//     ### Example Input:
//     Question : Can you give me high-protein recipes that can be prepared in under 15 minutes?
//     ### Example Tags:
//     ["high protein", "15 minutes"]

//     IMPORTANT : If there are no tags then simply return [] empty array.

//     ---

//     Now generate tags for the following question:
//     ${event.data}

//     Tags:
//   `;
//   const response = await llm.complete({ prompt });
//   const arrayMatch = response.text.match(/\[([^\]]*)\]/)?.[0];
//   let tags: string[] = [];

//   if (arrayMatch) {
//     try {
//       tags = JSON.parse(arrayMatch);
//       console.log("arrayMatch tags : ", tags);
//     } catch (error) {
//       const fallbackTags =
//         arrayMatch.match(/"([^"]+)"/g)?.map((tag) => tag.replace(/"/g, "")) ||
//         [];
//       tags = fallbackTags;
//     }
//   } else {
//     tags = [];
//   }

//   return returnTagsEvent.with({ tags: tags, originalQuestion: event.data });
// });

// workflow.handle([returnTagsEvent], async (event) => {
//   const tags = event.data.tags;
//   console.log("tags : ", tags);
//   const prompt = `
//   You are a helpful assistant that extracts tags from a provided array based on exact word or phrase matches in the user's question.

//   Instructions:
//   - Match tags exactly as they appear in the provided tags array (case-insensitive match, but output in lowercase).
//   - Do NOT include tags that are only partial matches.
//   - Do NOT include duplicates.
//   - Return ONLY a JSON array of lowercase matching tags — no text, no explanations.
//   - If there are no matches, return an empty array [].

//   Example:
//   Question: Can you give me mango ice cream recipes?
//   Provided Tags: ["mango", "ice cream", "quick", "easy", "15 minutes"]
//   Output: ["mango", "ice cream"]

//   ---

//   Now generate tags for the following question:
//   ${event.data.originalQuestion}

//   Tags:
//   `;

//   const response = await llm.complete({
//     prompt,
//     responseFormat: {
//       type: "json_schema",
//       json_schema: {
//         name: "recipeTags",
//         schema: {
//           type: "object",
//           properties: {
//             tags: { type: "array" },
//             key_features: {
//               type: "array",
//               items: { type: "string" },
//             },
//           },
//           additionalProperties: false,
//         },
//       },
//     },
//   });

//   console.log("RESPONSE FROM THE LLM : ", response.text);
//   let refinedTags: string[] = [];
//   try {
//     const parsedResponse = JSON.parse(response.text);
//     refinedTags = parsedResponse.tags || [];
//     console.log("Extracted tags array:", refinedTags);
//   } catch (error) {
//     console.error("Error parsing LLM response:", error);
//     refinedTags = tags;
//   }
//   return refineResponseEvent.with({ refinedTags: refinedTags });
// });

// workflow.handle([refineResponseEvent], async (event) => {
//   const tags = event.data.refinedTags;
//   console.log("refinedTags : ", tags);
//   const qdrantResults = await getRecipeFromQdrant(tags);
//   console.log("qdrantResults : ", qdrantResults);

//   return getRecipeFromQdrantEvent.with({ response: qdrantResults });
// });

// export async function main(query: string) {
//   const { stream, sendEvent } = workflow.createContext();
//   sendEvent(interpretQuestionEvent.with(query));
//   let result: { response: any } | undefined;
//   for await (const event of stream) {
//     if (getRecipeFromQdrantEvent.include(event)) {
//       result = event.data;
//       break;
//     }
//   }
//   console.log("Result : ", result?.response);
//   return result?.response;
// }

// Reranking function to improve accuracy
async function rerankRecipes(query: string, recipeIds: number[], llm: Groq) {
  if (recipeIds.length === 0) return [];

  clearCacheIfNeeded();

  try {
    const maxRecipesToRerank = 10;
    const recipesToRerank = recipeIds.slice(0, maxRecipesToRerank);

    const recipeDetails = await Promise.all(
      recipesToRerank.map(async (id) => {
        if (recipeCache.has(id)) {
          return recipeCache.get(id);
        }

        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/getRecipeDetailsById?id=${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            recipeCache.set(id, data.result);
            return data.result;
          }
          return null;
        } catch (error) {
          console.error(`Error fetching recipe ${id}:`, error);
          return null;
        }
      })
    );

    const validRecipes = recipeDetails.filter((recipe) => recipe !== null);

    if (validRecipes.length === 0) return recipeIds;

    try {
      const rerankedIds = await performLLMReranking(query, validRecipes, llm);
      if (rerankedIds.length > 0) {
        const remainingRecipes = recipeIds.slice(maxRecipesToRerank);
        const finalRecipeIds = [...rerankedIds, ...remainingRecipes];
        console.log("LLM reranked recipes:", finalRecipeIds);
        return finalRecipeIds;
      }
    } catch (error) {
      console.error(
        "LLM reranking failed, falling back to simple reranking:",
        error
      );
    }

    const simpleRerankedIds = performSimpleReranking(query, validRecipes);
    const remainingRecipes = recipeIds.slice(maxRecipesToRerank);
    const finalRecipeIds = [...simpleRerankedIds, ...remainingRecipes];

    console.log("Simple reranked recipes:", finalRecipeIds);
    return finalRecipeIds;
  } catch (error) {
    console.error("Error in reranking:", error);
    return recipeIds;
  }
}

async function performLLMReranking(query: string, recipes: any[], llm: Groq) {
  const rerankingPrompt = `
You are a recipe recommendation expert. Analyze the following recipes and rank them by relevance to the user's query.

User Query: "${query}"

Evaluation Criteria:
1. Ingredient matches (0-3 points)
2. Dietary requirements alignment (0-2 points)  
3. Cooking time and difficulty match (0-2 points)
4. Cuisine type relevance (0-1 point)
5. Meal type appropriateness (0-1 point)
6. Overall query alignment (0-1 point)

Recipe Details:
${recipes
  .map(
    (recipe, index) => `
Recipe ${index + 1} (ID: ${recipe.recipeId}):
- Title: ${recipe.title}
- Description: ${recipe.description || "No description"}
- Category: ${recipe.category || "Uncategorized"}
- Difficulty: ${recipe.difficulty || "Not specified"}
- Prep Time: ${recipe.prepTime || 0} minutes
- Cook Time: ${recipe.cookTime || 0} minutes
- Tags: ${recipe.tags?.map((tag: any) => tag.tag?.name).join(", ") || "None"}
- Ingredients: ${
      recipe.ingredients?.map((ing: any) => ing.ingredient?.name).join(", ") ||
      "None"
    }
`
  )
  .join("\n")}

Return ONLY a valid JSON array with objects containing recipeId and relevanceScore (1-10), sorted by relevance (highest first).

Format:
[{"recipeId": 123, "relevanceScore": 9}, {"recipeId": 456, "relevanceScore": 7}]
`;

  const rerankingResponse = await llm.complete({
    prompt: rerankingPrompt,
  });

  const cleanedResponse = rerankingResponse.text.trim();
  const jsonStart = cleanedResponse.indexOf("[");
  const jsonEnd = cleanedResponse.lastIndexOf("]") + 1;

  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    const jsonString = cleanedResponse.substring(jsonStart, jsonEnd);
    const rankedRecipes = JSON.parse(jsonString);

    if (Array.isArray(rankedRecipes)) {
      const validRankedRecipes = rankedRecipes.filter(
        (item: any) =>
          item &&
          typeof item.recipeId === "number" &&
          typeof item.relevanceScore === "number"
      );

      if (validRankedRecipes.length > 0) {
        return validRankedRecipes
          .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
          .map((item: any) => item.recipeId);
      }
    }
  }

  throw new Error("Failed to parse LLM reranking response");
}

function performSimpleReranking(query: string, recipes: any[]) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2);

  const scoredRecipes = recipes.map((recipe) => {
    let score = 0;
    const title = (recipe.title || "").toLowerCase();
    const description = (recipe.description || "").toLowerCase();
    const tags =
      recipe.tags?.map((tag: any) => tag.tag?.name?.toLowerCase()).join(" ") ||
      "";
    const ingredients =
      recipe.ingredients
        ?.map((ing: any) => ing.ingredient?.name?.toLowerCase())
        .join(" ") || "";
    const category = (recipe.category || "").toLowerCase();

    const allText = `${title} ${description} ${tags} ${ingredients} ${category}`;

    queryWords.forEach((word) => {
      if (allText.includes(word)) {
        score += 2;
      }
    });

    queryWords.forEach((word) => {
      if (title.includes(word)) {
        score += 3;
      }
    });

    queryWords.forEach((word) => {
      if (ingredients.includes(word)) {
        score += 2;
      }
    });

    return { recipeId: recipe.recipeId, score };
  });

  return scoredRecipes
    .sort((a, b) => b.score - a.score)
    .map((item) => item.recipeId);
}

export async function main(query: string) {
  Settings.llm = new Groq({
    model: process.env.MODEL ?? "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY!,
  });

  Settings.embedModel = new HuggingFaceAPIEmbedding();

  const qdrantStore = new QdrantVectorStore({
    url: process.env.QDRANT_URL,
    collectionName: process.env.QDRANT_COLLECTION,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const index = await VectorStoreIndex.fromVectorStore(qdrantStore);

  const queryEngine = index.asQueryEngine();
  const { message, sourceNodes } = await queryEngine.query({ query });

  const recipeIds =
    sourceNodes
      ?.map((node) => node.node?.metadata?.id)
      .filter((id) => id !== undefined) || [];

  console.log("Initial recipeIds from vector search:", recipeIds);

  const rerankedRecipeIds = await rerankRecipes(
    query,
    recipeIds,
    Settings.llm as Groq
  );

  console.log("Final reranked recipeIds:", rerankedRecipeIds);

  return {
    message: message.content,
    recipeIds: rerankedRecipeIds,
  };
}

"use server";
import {
  createStatefulMiddleware,
  createWorkflow,
  workflowEvent,
} from "@llamaindex/workflow";
import { groq } from "@llamaindex/groq";
import { getRecipeFromQdrant } from "../qdrant";

const llm = groq({
  model: process.env.GENERATE_TAGS_GROQ_MODEL!,
  apiKey: process.env.GROQ_API_KEY!,
});

const interpretQuestionEvent = workflowEvent<string>();
const returnTagsEvent = workflowEvent<{ tags: string[] }>();
const getRecipeFromQdrantEvent = workflowEvent<{
  response: any;
}>();

const { withState, getContext } = createStatefulMiddleware(() => ({
  numIterations: 0,
  maxIterations: 3,
}));

const workflow = withState(createWorkflow());

workflow.handle([interpretQuestionEvent], async (event) => {
  const prompt = `
    You are a helpful assistant that extracts relevant tags from user question. 
    Given the users question, return a JSON array of concise, lowercase tags that describe the recipe.
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
    Question : Can you give me high-protein recipes that can be prepared in under 15 minutes?
    ### Example Tags:
    ["high protein", "15 minutes"]

    IMPORTANT : If there are no tags then simply return [] empty array.

    ---

    Now generate tags for the following question:
    ${event.data}

    Tags:
  `;
  const response = await llm.complete({ prompt });
  const arrayMatch = response.text.match(/\[([^\]]*)\]/)?.[0];
  let tags: string[] = [];

  if (arrayMatch) {
    try {
      tags = JSON.parse(arrayMatch);
      console.log("arrayMatch tags : ", tags);
    } catch (error) {
      const fallbackTags =
        arrayMatch.match(/"([^"]+)"/g)?.map((tag) => tag.replace(/"/g, "")) ||
        [];
      tags = fallbackTags;
    }
  } else {
    tags = [];
  }

  return returnTagsEvent.with({ tags: tags });
});

workflow.handle([returnTagsEvent], async (event) => {
  const tags = event.data.tags;
  console.log("tags : ", tags);
  const qdrantResults = await getRecipeFromQdrant(tags);
  console.log("qdrantResults : ", qdrantResults);

  return getRecipeFromQdrantEvent.with({ response: qdrantResults });
});

export async function main(query: string) {
  const { stream, sendEvent } = workflow.createContext();
  sendEvent(interpretQuestionEvent.with(query));
  let result: { response: any } | undefined;
  for await (const event of stream) {
    if (getRecipeFromQdrantEvent.include(event)) {
      result = event.data;
      break;
    }
  }
  console.log("Result : ", result?.response);
  return result?.response;
}

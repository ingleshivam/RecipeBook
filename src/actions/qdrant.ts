"use server";
import {
  Document,
  Settings,
  storageContextFromDefaults,
  VectorStoreIndex,
} from "llamaindex";
import { initSettings } from "./initSettings";
import { QdrantVectorStore } from "@llamaindex/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { InferenceClient } from "@huggingface/inference";
import { Text } from "lucide-react";
import { HuggingFaceAPIEmbedding } from "@/lib/embedModel";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = process.env.QDRANT_COLLECTION as string;
export async function initializeCollection() {
  try {
    const collections = await client.getCollections();

    const collectionExists = collections.collections.some(
      (col) => col.name === COLLECTION_NAME
    );

    if (!collectionExists) {
      await client.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1024,
          distance: "Cosine",
        },
      });
    } else {
    }
  } catch (error) {
    throw error; // Re-throw to handle in calling function
  }
}

export async function getEmbeddingHF(text: string) {
  const client = new InferenceClient(process.env.HF_TOKEN);
  const output = await client.featureExtraction({
    model: "intfloat/multilingual-e5-large",
    inputs: text,
    provider: "hf-inference",
  });
  return output as number[];
}

export async function storeRecipeInQdrant(
  id: number,
  text: string,
  tags: string[]
) {
  const vector = await getEmbeddingHF(text);

  try {
    await client.upsert(COLLECTION_NAME, {
      points: [
        {
          id: id,
          vector: vector,
          payload: {
            recipeId: id,
            tags: tags.map((tag) => ({ name: tag })),
            text: text,
          },
        },
      ],
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function storeRecipoeInQdrantUsingLlamaIndex(
  id: number,
  text: string,
  tags: string[]
) {
  try {
    Settings.embedModel = new HuggingFaceAPIEmbedding();

    const qdrantStore = new QdrantVectorStore({
      url: process.env.QDRANT_URL,
      collectionName: process.env.QDRANT_COLLECTION,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const document = new Document({
      text: text,
      metadata: {
        id: id,
        tags: tags,
      },
    });

    const documents = [document];
    const storageContext = await storageContextFromDefaults({
      vectorStore: qdrantStore,
    });

    const index = await VectorStoreIndex.fromDocuments(documents, {
      storageContext,
    });

    console.log(`Recipe ${id} stored successfully in Qdrant`);
    return { success: true, message: `Recipe ${id} stored successfully` };
  } catch (error) {
    console.error("Error storing recipe in Qdrant:", error);
    return { success: false, error: error };
  }
}

export async function getRecipeFromQdrant(query: string[]) {
  try {
    if (query.length === 0) {
      const allPoints: any[] = [];

      const { points } = await client.scroll(COLLECTION_NAME, {
        limit: 20,
        with_payload: true,
      });

      allPoints.push(...points);
      console.log("ALL POINTS : ", allPoints);
      const ids = allPoints.map((point) => point.id);
      return ids;
    }

    const results = await Promise.all(
      query.map(async (item) => {
        const vector = await getEmbeddingHF(item);

        try {
          await client.createPayloadIndex(COLLECTION_NAME, {
            field_name: "tags[].name",
            field_schema: "keyword",
          });

          const result = await client.search(COLLECTION_NAME, {
            vector: vector,
            limit: 20,
            with_payload: true,
            filter: {
              must: [
                {
                  key: "tags[].name",
                  match: {
                    value: item,
                  },
                },
              ],
            },
          });

          const ids = result.map((point) => point.id);
          return ids;
        } catch (error: any) {
          return [];
        }
      })
    );

    const allIds = results
      .flat()
      .filter((id, index, self) => self.indexOf(id) === index);

    return allIds;
  } catch (error) {
    return [];
  }
}

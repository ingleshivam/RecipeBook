// lib/HuggingFaceAPIEmbedding.ts
import { InferenceClient } from "@huggingface/inference";
import { BaseEmbedding, MessageContentDetail } from "llamaindex";

export class HuggingFaceAPIEmbedding extends BaseEmbedding {
  private client: InferenceClient;
  private model: string;

  constructor(model = "intfloat/multilingual-e5-large") {
    super();
    this.client = new InferenceClient(process.env.HF_TOKEN!);
    this.model = model;
  }

  private async embed(text: string): Promise<number[]> {
    const res = await this.client.featureExtraction({
      model: this.model,
      inputs: text,
      provider: "hf-inference",
    });

    if (Array.isArray(res) && Array.isArray(res[0])) {
      return res[0] as number[];
    }
    return res as number[];
  }

  async getTextEmbedding(text: string): Promise<number[]> {
    return this.embed(text);
  }

  async getQueryEmbedding(
    query: MessageContentDetail
  ): Promise<number[] | null> {
    let queryText = "";

    if (typeof query === "string") {
      queryText = query;
    } else if (Array.isArray(query)) {
      queryText = query.map((q) => q?.text ?? "").join(" ");
    } else if (typeof query === "object" && "text" in query) {
      queryText = query.text ?? "";
    }

    if (!queryText.trim()) return null;
    return this.embed(queryText);
  }
}

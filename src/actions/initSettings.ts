import { Settings } from "llamaindex";
import { Groq } from "@llamaindex/groq";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";

export function initSettings() {
  Settings.llm = new Groq({
    model: process.env.MODEL ?? "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY!,
  });

  Settings.embedModel = new HuggingFaceEmbedding({
    modelType: "BAAI/bge-large-en-v1.5",
  });
}

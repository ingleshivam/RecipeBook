import { Settings } from "llamaindex";
import { Groq } from "@llamaindex/groq";
import { HuggingFaceEmbedding } from "@llamaindex/huggingface";

export function initSettings() {
  Settings.llm = new Groq({
    model: process.env.MODEL ?? "llama3-8b-8192",
    apiKey: process.env.GROQ_API_KEY!,
  });

  Settings.embedModel = new HuggingFaceEmbedding({
    modelType:
      process.env.EMBEDDING_MODEL ?? "sentence-transformers/all-MiniLM-L6-v2",
  });
}

// import Groq from "groq-sdk";

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function main() {
//   const chatCompletion = await getGroqChatCompletion();
//   // Print the completion returned by the LLM.
//   console.log(chatCompletion.choices[0]?.message?.content || "");
// }

// export async function getGroqChatCompletion() {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: "Explain the importance of fast language models",
//       },
//     ],
//     model: "llama-3.3-70b-versatile",
//   });
// }

import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function getGeneratedResult() {
  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),
    prompt: "Write a vegetarian lasagna recipe for 4 people.",
  });

  console.log("Generated Result :", text);
}

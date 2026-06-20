// src/services/chat.service.ts
import { gemini } from "@/lib/gemini";

export async function streamChatResponse(message: string) {
  return gemini.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: message }],
      },
    ],
  });
}
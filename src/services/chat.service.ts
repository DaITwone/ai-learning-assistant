import { gemini } from "@/lib/gemini";
import { ConversationRepository } from "@/repositories/conversation.repository";
import { MessageRepository } from "@/repositories/message.repository";

type StreamChatInput = {
  userId: string;
  conversationId: string;
  message: string;
};

export async function streamChatResponse(input: StreamChatInput) {
  const conversation = await ConversationRepository.findByIdAndUserId(
    input.conversationId,
    input.userId,
  );

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const existingMessages = await MessageRepository.findManyByConversationId(
    input.conversationId,
  );

  if (existingMessages.length === 0 && conversation.title === "New chat") {
    await ConversationRepository.updateTitle(
      input.conversationId,
      input.userId,
      createConversationTitleFromMessage(input.message),
    );
  }

  await MessageRepository.create({
    conversationId: input.conversationId,
    role: "user",
    type: "text",
    content: input.message,
  });

  const result = await gemini.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: input.message }],
      },
    ],
  });

  return result;
}

export async function saveAssistantMessage(
  conversationId: string,
  content: string,
) {
  if (!content.trim()) return;

  await MessageRepository.create({
    conversationId,
    role: "assistant",
    type: "text",
    content,
  });

  await ConversationRepository.touch(conversationId);
}

function createConversationTitleFromMessage(message: string) {
  const title = message.trim().slice(0, 120);

  return title.length > 0 ? title : "New chat";
}

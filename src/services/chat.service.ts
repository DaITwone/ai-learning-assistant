import { gemini } from "@/lib/gemini";
import { ConversationRepository } from "@/repositories/conversation.repository";
import { MessageRepository } from "@/repositories/message.repository";

type StreamChatInput = {
  userId: string;
  conversationId: string;
  message: string;
};

type GeminiRole = "user" | "model";

type GeminiContent = {
  role: GeminiRole;
  parts: { text: string }[];
};

// Tạo tiêu đề mặc định cho conversation từ tin nhắn đầu tiên của người dùng
function createConversationTitleFromMessage(message: string) {
  const title = message.trim().slice(0, 120);

  return title.length > 0 ? title : "New chat";
}

const MAX_CONTEXT_MESSAGES = 20;

function buildGeminiContents(
  messages: Awaited<
    ReturnType<typeof MessageRepository.findManyByConversationId>
  >,
  currentMessage: string,
): GeminiContent[] {
  const historyMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  return [
    ...historyMessages.map((message): GeminiContent => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    {
      role: "user",
      parts: [{ text: currentMessage }],
    },
  ];
}

// Đảm bảo người dùng chỉ được truy cập convers của chính họ
export async function streamChatResponse(input: StreamChatInput) {
  // Xác thực convers tồn tại và thuộc về user hiện tại
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

  // Chỉ đặt tiêu đề tự động cho convers mới khi chưa có tin nhắn nào
  if (existingMessages.length === 0) {
    await ConversationRepository.updateTitle(
      input.conversationId,
      input.userId,
      createConversationTitleFromMessage(input.message),
    );
  }

  const geminiContents = buildGeminiContents(existingMessages, input.message);

  await MessageRepository.create({
    conversationId: input.conversationId,
    role: "user",
    type: "text",
    content: input.message,
  });

  const result = await gemini.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: geminiContents,
  });

  return result;
}

// Lưu phản hồi hoàn chỉnh của AI sau khi quá trình stream kết thúc
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

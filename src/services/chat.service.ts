import { gemini } from "@/lib/gemini";
import { parseQuizPayload } from "@/lib/quiz";
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

// Prompt hệ thống dùng để ép AI trả về JSON thuần khi người dùng yêu cầu tạo quiz,
// giúp backend có thể parse và lưu quiz mà không cần xử lý thêm markdown/text dư thừa.
const SYSTEM_INSTRUCTION = `Bạn là một trợ lý học tập lập trình. Nếu người dùng yêu cầu "tạo quiz" hoặc "quiz" thì hãy trả về DUY NHẤT một JSON hợp lệ với cấu trúc sau:
{
  "title": "Tiêu đề quiz",
  "topic": "Chủ đề quiz",
  "questions": [
    {
      "question": "Câu hỏi?",
      "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"],
      "answerIndex": 0
    }
  ]
}
Nếu người dùng không yêu cầu tạo quiz thì vẫn trả lời bình thường bằng tiếng Việt.
Không thêm markdown, không thêm giải thích, không thêm văn bản ngoài JSON khi trả về quiz.`;

// Tạo tiêu đề mặc định cho conversation từ tin nhắn đầu tiên của người dùng
function createConversationTitleFromMessage(message: string) {
  const title = message.trim().slice(0, 120);

  return title.length > 0 ? title : "New chat";
}

const MAX_CONTEXT_MESSAGES = 20;

// Không gửi toàn bộ nội dung quiz cũ vào context vì có thể làm tăng token đáng kể.
// Chỉ giữ metadata để AI biết cuộc trò chuyện trước đó đã sinh quiz gì.
function convertMessageToGeminiContent(
  message: Awaited<
    ReturnType<typeof MessageRepository.findManyByConversationId>
  >[number],
): GeminiContent {
  if (message.type === "quiz") {
    try {
      const quiz = JSON.parse(message.content);

      return {
        role: message.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: `Đã tạo quiz: ${quiz.title ?? "Quiz"} về chủ đề ${
              quiz.topic ?? "Unknown"
            }`,
          },
        ],
      };
    } catch {
      return {
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: "[Quiz generated]" }],
      };
    }
  }

  return {
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  };
}

// Ghép system instruction + lịch sử chat gần nhất + tin nhắn hiện tại
// thành context hoàn chỉnh gửi sang Gemini.
function buildGeminiContents(
  messages: Awaited<
    ReturnType<typeof MessageRepository.findManyByConversationId>
  >,
  currentMessage: string,
): GeminiContent[] {
  const historyMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  return [
    {
      role: "user",
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    ...historyMessages.map(convertMessageToGeminiContent),
    {
      role: "user",
      parts: [{ text: currentMessage }],
    },
  ];
}

// Đảm bảo người dùng chỉ được truy cập conversation của chính họ
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

  const quizPayload = parseQuizPayload(content);

  await MessageRepository.create({
    conversationId,
    role: "assistant",
    type: quizPayload ? "quiz" : "text",
    content: quizPayload ? JSON.stringify(quizPayload) : content,
  });

  await ConversationRepository.touch(conversationId);
}

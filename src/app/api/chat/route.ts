import { auth } from "@/lib/auth";
import {
  saveAssistantMessage,
  streamChatResponse,
} from "@/services/chat.service";

type ChatStreamError = {
  code: string;
  message: string;
  retryAfterSeconds?: number;
};

function getErrorStatus(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    return error.status;
  }

  return null;
}

// Chuẩn hóa message lỗi trả về cho client để tránh expose chi tiết từ AI Provider
function getChatStreamError(error: unknown): ChatStreamError {
  const status = getErrorStatus(error);

  if (status === 429) {
    return {
      code: "RATE_LIMITED",
      message:
        "Gemini API đang bị giới hạn quota. Bạn chờ một lát rồi thử lại nhé.",
      retryAfterSeconds: 60,
    };
  }

  if (error instanceof Error && error.message === "Conversation not found") {
    return {
      code: "CONVERSATION_NOT_FOUND",
      message:
        "Cuộc trò chuyện không tồn tại hoặc bạn không có quyền truy cập.",
    };
  }

  if (status && status >= 500) {
    return {
      code: "AI_PROVIDER_ERROR",
      message: "Gemini đang gặp sự cố. Bạn thử lại sau một lát nhé.",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "Tớ chưa thể tạo phản hồi lúc này. Bạn thử lại nhé.",
  };
}

export async function POST(request: Request) {
  // Chỉ cho phép stream chat khi request thuộc về user đã đăng nhập.
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const message = body.message;
  const conversationId = body.conversationId;

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  if (!conversationId || typeof conversationId !== "string") {
    return Response.json(
      { error: "Conversation ID is required" },
      { status: 400 },
    );
  }

  // SSE chỉ gửi dữ liệu dạng binary stream nên cần encode text trước khi enqueue
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let assistantContent = "";

      try {
        const result = await streamChatResponse({
          userId: session.user.id,
          conversationId,
          message,
        });

        for await (const chunk of result) {
          const text = chunk.text;

          if (text) {
            assistantContent += text;

            // Gửi chunk theo chuẩn SSE để FE cập nhật nội dung theo thời gian thực
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
            );
          }
        }

        try {
          // Chỉ lưu message sau khi stream hoàn tất để tránh lưu dữ liệu AI chưa trả đủ.
          await saveAssistantMessage(conversationId, assistantContent);
        } catch (error) {
          console.error("Failed to save assistant message:", error);

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "warning",
                warning: {
                  code: "MESSAGE_SAVE_FAILED",
                  message:
                    "Câu trả lời đã được tạo nhưng chưa lưu được vào lịch sử.",
                },
              })}\n\n`,
            ),
          );
        }
        // Signal kết thúc stream để frontend biết có thể dừng trạng thái "AI đang trả lời".
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        console.error("Chat stream error:", error);

        const streamError = getChatStreamError(error);

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              error: streamError,
            })}\n\n`,
          ),
        );

        controller.close();
      }
    },
  });

  // Thiết lập header SSE để giữ kết nối cho phép client nhận dữ liệu theo từng chunk.
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

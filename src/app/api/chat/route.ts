import { auth } from "@/lib/auth";
import {
  saveAssistantMessage,
  streamChatResponse,
} from "@/services/chat.service";

export async function POST(request: Request) {
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

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
            );
          }
        }

        await saveAssistantMessage(conversationId, assistantContent);

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              error: "Failed to generate response",
            })}\n\n`,
          ),
        );

        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
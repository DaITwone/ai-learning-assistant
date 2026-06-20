import { auth } from "@/lib/auth";
import { ConversationService } from "@/services/conversation.service";

type RouteContext = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId } = await context.params;

  try {
    const messages = await ConversationService.getMessages(
      session.user.id,
      conversationId,
    );

    return Response.json({ messages });
  } catch {
    return Response.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }
}
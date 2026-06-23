import { auth } from "@/lib/auth";
import { ConversationService } from "@/services/conversation.service";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await ConversationService.getConversations(
    session.user.id,
  );

  return Response.json({ conversations });
}

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await ConversationService.createConversation(
    session.user.id,
  );

  return Response.json({ conversation }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId, title } = await request.json();

  if (
    !conversationId ||
    typeof conversationId !== "string" ||
    !title ||
    typeof title !== "string" ||
    !title.trim()
  ) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    await ConversationService.updateConversationTitle(
      session.user.id,
      conversationId,
      title.trim(),
    );

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: "Conversation not found" },
      { status: 404 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { conversationId } = await request.json();

  await ConversationService.deleteConversation(
    session.user.id,
    conversationId,
  );

  return Response.json({ success: true });
}
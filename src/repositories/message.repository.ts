import { prisma } from "@/lib/prisma";
import type { MessageRole, MessageType } from "@/types/message";

type CreateMessageInput = {
  conversationId: string;
  role: MessageRole;
  type?: MessageType;
  content: string;
};

export class MessageRepository {
  static findManyByConversationId(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        type: true,
        content: true,
        createdAt: true,
      },
    });
  }

  static create(input: CreateMessageInput) {
    return prisma.message.create({
      data: {
        conversationId: input.conversationId,
        role: input.role,
        type: input.type ?? "text",
        content: input.content,
      },
    });
  }
}
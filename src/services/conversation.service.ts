import { ConversationRepository } from "@/repositories/conversation.repository";
import { MessageRepository } from "@/repositories/message.repository";

export class ConversationService {
  static async getConversations(userId: string) {
    const conversations = await ConversationRepository.findManyByUserId(userId);

    return conversations.map((conversation) => ({
      ...conversation,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    }));
  }

  static async createConversation(userId: string) {
    const conversation = await ConversationRepository.create(userId);

    return {
      ...conversation,
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    };
  }

  static async getMessages(userId: string, conversationId: string) {
    const conversation = await ConversationRepository.findByIdAndUserId(
      conversationId,
      userId,
    );

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messages = await MessageRepository.findManyByConversationId(
      conversationId,
    );

    return messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));
  }
}
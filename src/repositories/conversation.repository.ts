import { prisma } from "@/lib/prisma";

export class ConversationRepository {
  static findManyByUserId(userId: string) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static findByIdAndUserId(id: string, userId: string) {
    return prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  static create(userId: string, title = "New chat") {
    return prisma.conversation.create({
      data: {
        userId,
        title,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  static updateTitle(id: string, userId: string, title: string) {
    return prisma.conversation.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        title,
      },
    });
  }

  static touch(id: string) {
    return prisma.conversation.update({
      where: { id },
      data: {
        updatedAt: new Date(),
      },
    });
  }

  static delete(id: string, userId: string) {
    return prisma.conversation.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}

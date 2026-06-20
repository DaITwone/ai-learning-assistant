"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/message";
import type { Conversation } from "@/types/conversation";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";

const initialConversations: Conversation[] = [
  {
    id: "conversation-1",
    title: "Explain React useState",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "conversation-2",
    title: "JavaScript async await",
    updatedAt: new Date().toISOString(),
  },
];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    type: "text",
    content: "Xin chào! Tớ có thể giúp gì cho bạn.",
    createdAt: new Date().toISOString(),
  },
];

export function ChatPageClient() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversations[0]?.id ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  function handleCreateConversation() {
    const newConversation: Conversation = {
      id: crypto.randomUUID(),
      title: "New chat",
      updatedAt: new Date().toISOString(),
    };

    setConversations((currentConversations) => [
      newConversation,
      ...currentConversations,
    ]);

    setSelectedConversationId(newConversation.id);
    setMessages(initialMessages);
  }

  function handleSelectConversation(conversationId: string) {
    setSelectedConversationId(conversationId);

    // Tạm thời reset mock messages.
    // Sau này chỗ này sẽ gọi GET /api/conversations/:id/messages.
    setMessages(initialMessages);
  }

  async function handleSend(content: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      type: "text",
      content,
      createdAt: new Date().toISOString(),
    };

    const assistantMessageId = crypto.randomUUID();

    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      type: "text",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);

    try {

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.replace("data: ", "");

          if (data === "[DONE]") {
            return;
          }

          const parsed = JSON.parse(data);

          if (parsed.text) {
            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === assistantMessageId
                  ? {
                      ...message,
                      content: message.content + parsed.text,
                    }
                  : message,
              ),
            );
          }

          if (parsed.error) {
            throw new Error(parsed.error);
          }
        }
      }
    } catch (error) {
      console.error(error);

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content:
                  "Xin lỗi, tớ chưa thể trả lời lúc này. Bạn thử lại nhé.",
              }
            : message,
        ),
      );
    } finally {
      //
    }
  }

  return (
    <main className="flex h-screen bg-slate-50">
      <ChatSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="px-6 py-3.5">
          <h1 className="text-lg font-semibold">AI Learning Assistant</h1>
        </header>

        <MessageList
          messages={messages}
        />
        <ChatInput onSend={handleSend} />
      </section>
    </main>
  );
}

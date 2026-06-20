"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/conversation";
import type { ChatMessage } from "@/types/message";
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
    content: "Xin chào! Tớ có thể giúp gì cho bạn?",
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    }
  }

  return (
    <main className="flex h-dvh overflow-hidden bg-slate-50">
      <ChatSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/70 bg-slate-50 px-3 sm:px-6 md:border-b-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="size-5 text-slate-700" />
          </Button>

          <h1 className="truncate text-base font-semibold sm:text-lg">
            AI Learning Assistant
          </h1>
        </header>

        <MessageList messages={messages} />
        <ChatInput onSend={handleSend} />
      </section>
    </main>
  );
}

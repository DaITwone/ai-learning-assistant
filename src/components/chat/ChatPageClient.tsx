"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/conversation";
import type { ChatMessage } from "@/types/message";
import { ChatInput } from "./ChatInput";
import { ChatSidebar } from "./ChatSidebar";
import { MessageList } from "./MessageList";

type ApiConversation = Omit<Conversation, "createAt"> & {
  createdAt?: string;
  createAt?: string;
};

// Tải danh sách conversation và tự động mở conversation đầu tiên
// Chuẩn hóa dữ liệu, hàm dùng để xử lý trường createAt, createdAt cho thống nhất.
function normalizeConversation(conversation: ApiConversation): Conversation {
  return {
    ...conversation,
    createAt:
      conversation.createAt ?? conversation.createdAt ?? conversation.updatedAt,
  };
}

export function ChatPageClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Khởi tạo dữ liệu ban đầu:
  // 1. Lấy danh sách cuộc trò chuyện
  // 2. Chọn conversation đầu tiên nếu tồn tại
  // 3. Tải lịch sử tin nhắn tương ứng
  // 4. Tránh cập nhật state khi component đã unmount
  useEffect(() => {
    let isMounted = true;

    // Hàm gọi API lấy danh sách conversation
    async function loadConversations() {
      try {
        const response = await fetch("/api/conversations");

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();
        const loadedConversations = data.conversations.map(
          normalizeConversation,
        );

        if (!isMounted) return;

        setConversations(loadedConversations);

        const firstConversation = loadedConversations[0];

        if (firstConversation) {
          setSelectedConversationId(firstConversation.id);
          await loadMessages(firstConversation.id, isMounted);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void loadConversations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Lấy lịch sử tin nhắn của một conversation
  async function loadMessages(conversationId: string, shouldUpdate = true) {
    const response = await fetch(
      `/api/conversations/${conversationId}/messages`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const data = await response.json();
    const loadedMessages = data.messages as ChatMessage[];

    // Cho phép tái sử dụng hàm để lấy dữ liệu mà không cần cập nhật UI
    if (shouldUpdate) {
      setMessages(loadedMessages);
    }

    return loadedMessages;
  }

  // Tạo conversation mới và cập nhật state cục bộ ngay lập tức
  async function createConversation() {
    const response = await fetch("/api/conversations", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    const data = await response.json();
    const newConversation = normalizeConversation(data.conversation);

    setConversations((currentConversations) => [
      newConversation,
      ...currentConversations,
    ]);
    setSelectedConversationId(newConversation.id);
    setMessages([]);

    return newConversation;
  }

  async function handleCreateConversation() {
    try {
      await createConversation();
    } catch (error) {
      console.error(error);
    }
  }

  // Chuyển sang conersation khác và tải lại lịch sử tin nhắn
  async function handleSelectConversation(conversationId: string) {
    try {
      setSelectedConversationId(conversationId);
      setMessages([]);
      await loadMessages(conversationId);
    } catch (error) {
      console.error(error);
    }
  }

  // Đồng bộ lại danh sách conversation sau khi có thay đổi từ server
  async function refreshConversations() {
    const response = await fetch("/api/conversations");

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();

    setConversations(data.conversations.map(normalizeConversation));
  }

  // Gửi tin nhắn người dùng và xử lý phản hồi AI theo dạng stream
  async function handleSend(content: string) {
    let conversationId = selectedConversationId;

    if (!conversationId) {
      try {
        const conversation = await createConversation();
        conversationId = conversation.id;
      } catch (error) {
        console.error(error);
        return;
      }
    }

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
        body: JSON.stringify({
          conversationId,
          message: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Buffer lưu dữ liệu chưa hoàn chỉnh giữa các lần đọc stream.
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const data = line.replace("data: ", "");

          // AI đã trả lời xong, đồng bộ lại danh sách conversation
          if (data === "[DONE]") {
            try {
              await refreshConversations();
            } catch (error) {
              console.error(error);
            }

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
        onSelectConversation={(conversationId) => {
          void handleSelectConversation(conversationId);
        }}
        onCreateConversation={() => {
          void handleCreateConversation();
        }}
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
        <ChatInput
          onSend={(content) => {
            void handleSend(content);
          }}
        />
      </section>
    </main>
  );
}

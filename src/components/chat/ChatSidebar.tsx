"use client";

import { useState } from "react";
import { MessageSquare, Search, SquarePen, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";
import Image from "next/image";

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
};

export function ChatSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-72",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-14 items-center",
          collapsed ? "justify-center" : "justify-between px-3",
        )}
      >
        <button
          type="button"
          onClick={() => {
            if (collapsed) {
              setCollapsed(false);
            }
          }}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
            collapsed && "hover:bg-slate-100",
          )}
        >
          {/* TODO: Replace with your logo */}
          <Image
            src="/icon.png"
            alt="Logo AI Learning Assistant"
            width={128}
            height={128}
            priority
            className="mx-auto rounded-md"
          />
        </button>

        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-slate-100"
            onClick={() => setCollapsed(true)}
          >
            <Menu className="size-5 text-slate-600" />
          </Button>
        )}
      </div>

      {/* Actions */}
      <div className="px-2 py-2">
        <button
          type="button"
          onClick={onCreateConversation}
          className={cn(
            "flex h-11 w-full items-center rounded-lg transition-colors hover:bg-slate-100",
            collapsed ? "justify-center" : "gap-3 px-3",
          )}
        >
          <SquarePen className="size-5 shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">Đoạn chat mới</span>
          )}
        </button>

        <button
          type="button"
          className={cn(
            "flex h-11 w-full items-center rounded-lg transition-colors hover:bg-slate-100",
            collapsed ? "justify-center" : "gap-3 px-3",
          )}
        >
          <Search className="size-5 shrink-0" />

          {!collapsed && (
            <span className="text-sm font-medium">Tìm kiếm đoạn chat</span>
          )}
        </button>
      </div>

      {/* Recent Chats */}
      <div className="flex min-h-0 flex-1 flex-col">
        {!collapsed && (
          <div className="px-4 py-2">
            <h3 className="text-sm font-semibold text-slate-500">Gần đây</h3>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2">
          {conversations.map((conversation) => {
            const isSelected = conversation.id === selectedConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "mb-1 flex w-full items-center rounded-lg transition-colors",
                  collapsed ? "justify-center p-3" : "gap-3 px-3 py-2",
                  isSelected
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-700 hover:bg-slate-100",
                )}
              >
                <MessageSquare className="size-4 shrink-0" />

                {!collapsed && (
                  <span className="truncate text-sm">{conversation.title}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-2.5">
        <button
          className={cn(
            "flex w-full items-center rounded-lg transition-colors hover:bg-slate-100",
            collapsed ? "justify-center p-2" : "gap-3 p-2",
          )}
        >
          <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white">
            D
          </div>

          {!collapsed && (
            <div className="min-w-0 text-left">
              <div className="truncate text-sm font-medium">Nguyễn Văn Đạt</div>

              <div className="text-xs text-slate-500">Go</div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}

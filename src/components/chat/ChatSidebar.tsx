"use client";

import Image from "next/image";
import { useState } from "react";
import { Menu, MessageSquare, Search, SquarePen, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function ChatSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  isMobileOpen = false,
  onMobileClose,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
    {/* Backdrop chỉ xuất hiện trên mobile để đóng sidebar khi người dùng click ra ngoài. */}
      <button
        type="button"
        aria-label="Đóng thanh bên"
        onClick={onMobileClose}
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/35 transition-opacity md:hidden",
          isMobileOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0",
        )}
      />
      
      {/* Desktop dùng sidebar cố định, mobile chuyển thành drawer trượt từ trái sang. */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-dvh w-[min(20rem,calc(100vw-2rem))] shrink-0 flex-col border-r bg-white transition-transform duration-300 md:static md:z-auto md:h-screen md:translate-x-0 md:transition-all",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:w-16" : "md:w-72",
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center",
            collapsed
              ? "justify-between px-3 md:justify-center md:px-0"
              : "justify-between px-3",
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
              className="hidden h-10 w-10 rounded-xl hover:bg-slate-100 md:inline-flex"
              onClick={() => setCollapsed(true)}
            >
              <Menu className="size-5 text-slate-600" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-slate-100 md:hidden"
            onClick={onMobileClose}
          >
            <X className="size-5 text-slate-600" />
          </Button>
        </div>

        <div className="px-2 py-2">
          <button
            type="button"
            onClick={() => {
              onCreateConversation();
              onMobileClose?.();
            }}
            className={cn(
              "flex h-11 w-full items-center rounded-lg transition-colors hover:bg-slate-100",
              collapsed
                ? "gap-3 px-3 md:justify-center md:px-0"
                : "gap-3 px-3",
            )}
          >
            <SquarePen className="size-5 shrink-0" />
            <span
              className={cn("text-sm font-medium", collapsed && "md:hidden")}
            >
              Đoạn chat mới
            </span>
          </button>

          <button
            type="button"
            className={cn(
              "flex h-11 w-full items-center rounded-lg transition-colors hover:bg-slate-100",
              collapsed
                ? "gap-3 px-3 md:justify-center md:px-0"
                : "gap-3 px-3",
            )}
          >
            <Search className="size-5 shrink-0" />
            <span
              className={cn("text-sm font-medium", collapsed && "md:hidden")}
            >
              Tìm kiếm đoạn chat
            </span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className={cn("px-4 py-2", collapsed && "md:hidden")}>
            <h3 className="text-sm font-semibold text-slate-500">Gần đây</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-2">
            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    onSelectConversation(conversation.id);
                    onMobileClose?.();
                  }}
                  className={cn(
                    "mb-1 flex w-full items-center rounded-lg transition-colors",
                    collapsed
                      ? "gap-3 px-3 py-2 md:justify-center md:p-3"
                      : "gap-3 px-3 py-2",
                    isSelected
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-700 hover:bg-slate-100",
                  )}
                >
                  <MessageSquare className="size-4 shrink-0" />
                  <span
                    className={cn(
                      "truncate text-sm",
                      collapsed && "md:hidden",
                    )}
                  >
                    {conversation.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t p-2.5">
          <button
            className={cn(
              "flex w-full items-center rounded-lg transition-colors hover:bg-slate-100",
              collapsed ? "gap-3 p-2 md:justify-center" : "gap-3 p-2",
            )}
          >
            <div className="flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white">
              D
            </div>

            <div
              className={cn("min-w-0 text-left", collapsed && "md:hidden")}
            >
              <div className="truncate text-sm font-medium">
                Nguyễn Văn Đạt
              </div>
              <div className="text-xs text-slate-500">Go</div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

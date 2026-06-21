"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Pin,
  Search,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";

type ChatSidebarProps = {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

export function ChatSidebar({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onCreateConversation,
  onDeleteConversation,
  isMobileOpen = false,
  onMobileClose,
}: ChatSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);

  const handleRequestDelete = (conversation: Conversation) => {
    // Đợi DropdownMenu đóng + trả focus xong rồi mới mở AlertDialog,
    // tránh xung đột giữa 2 lớp Radix portal khiến trang bị "đứng hình".
    setTimeout(() => setConversationToDelete(conversation), 0);
  };

  const handleConfirmDelete = () => {
    if (!conversationToDelete) return;
    onDeleteConversation(conversationToDelete.id);
    setConversationToDelete(null);
  };

  return (
    <>
      {/* Backdrop chỉ xuất hiện trên mobile để đóng sidebar khi người dùng click ra ngoài. */}
      <button
        type="button"
        aria-label="Đóng thanh bên"
        onClick={onMobileClose}
        className={cn(
          "fixed inset-0 z-30 bg-slate-950/35 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
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
              collapsed ? "gap-3 px-3 md:justify-center md:px-0" : "gap-3 px-3",
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
              collapsed ? "gap-3 px-3 md:justify-center md:px-0" : "gap-3 px-3",
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
                <div
                  key={conversation.id}
                  className={cn(
                    "group mb-1 flex h-11 items-center rounded-lg",
                    isSelected ? "bg-slate-100" : "hover:bg-slate-100",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      onMobileClose?.();
                    }}
                    className={cn(
                      "flex h-full min-w-0 flex-1 items-center",
                      collapsed
                        ? "gap-3 px-3 md:justify-center md:p-3"
                        : "gap-3 pl-3 pr-1",
                      isSelected ? "text-slate-950" : "text-slate-700",
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

                  {!collapsed && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Tuỳ chọn cho cuộc trò chuyện "${conversation.title}"`}
                          className="
                            mr-1.5 flex h-7 w-7 shrink-0 items-center justify-center
                            rounded-md
                            text-slate-400
                            opacity-0
                            transition-all duration-150
                            hover:bg-slate-200
                            hover:text-slate-700
                            group-hover:opacity-100
                            focus-visible:opacity-100
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-slate-400
                            data-[state=open]:bg-slate-200
                            data-[state=open]:text-slate-700
                            data-[state=open]:opacity-100
                          "
                        >
                          <MoreHorizontal className="size-4" />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-44 mt-3">
                        {/* TODO: bật lại khi tính năng đổi tên hoàn thiện */}
                        <DropdownMenuItem disabled className="gap-2">
                          <Pencil className="size-4" />
                          Đổi tên
                        </DropdownMenuItem>

                        {/* TODO: bật lại khi tính năng ghim hội thoại hoàn thiện */}
                        <DropdownMenuItem disabled className="gap-2">
                          <Pin className="size-4" />
                          Ghim
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onSelect={() => handleRequestDelete(conversation)}
                          className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          <Trash2 className="size-4" />
                          Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
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

            <div className={cn("min-w-0 text-left", collapsed && "md:hidden")}>
              <div className="truncate text-sm font-medium">Nguyễn Văn Đạt</div>
              <div className="text-xs text-slate-500">Go</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Dialog xác nhận xoá cuộc trò chuyện, dùng AlertDialog của shadcn thay cho window.confirm. */}
      <AlertDialog
        open={conversationToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setConversationToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xoá cuộc trò chuyện?</AlertDialogTitle>
            <AlertDialogDescription>
              “{conversationToDelete?.title}” sẽ bị xoá vĩnh viễn và không thể
              khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400"
            >
              Xoá cuộc trò chuyện
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
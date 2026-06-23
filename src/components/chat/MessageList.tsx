import Image from "next/image";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/message";
import { MessageRenderer } from "./MessageRenderer";

type MessageListProps = {
  messages: ChatMessage[];
  isAssistantLoading?: boolean;
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-5 sm:gap-6 sm:px-6 sm:py-8">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex min-w-0 items-end gap-2 sm:gap-3",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          {message.role === "assistant" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white sm:h-9 sm:w-9">
              <Image
                src="/icon.png"
                alt="Logo AI Learning Assistant"
                width={50}
                height={50}
                priority
                className="mx-auto rounded-md"
              />
            </div>
          )}

          <div
            className={cn(
              "min-w-0 wrap-break-word rounded-2xl px-4 py-3 text-sm shadow-sm sm:rounded-3xl sm:px-5 sm:text-base",
              message.role === "user"
                ? "max-w-[82%] bg-slate-950 text-white sm:max-w-[75%]"
                : "max-w-[calc(100%-2.5rem)] border border-slate-200 bg-white text-slate-900 sm:max-w-[90%]",
            )}
          >
            {message.role === "assistant" && !message.content ? (
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
              </div>
            ) : (
              <MessageRenderer message={message} />
            )}
          </div>

          {/* {message.role === "user" && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-bold text-white shadow-sm sm:h-9 sm:w-9">
              {initial}
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
}

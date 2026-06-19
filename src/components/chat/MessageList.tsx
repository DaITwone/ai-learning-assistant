import type { ChatMessage } from "@/types/message";
import { cn } from "@/lib/utils";
import { MessageRenderer } from "./MessageRenderer";
import Image from "next/image";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-end gap-3",
            message.role === "user" ? "justify-end" : "justify-start",
          )}
        >
          {message.role === "assistant" && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
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
              "rounded-3xl px-5 py-3 shadow-sm",
              message.role === "user"
                ? "max-w-[75%] bg-slate-950 text-white"
                : "max-w-[90%] border border-slate-200 bg-white text-slate-900",
            )}
          >
            <MessageRenderer message={message} />
          </div>

          {message.role === "user" && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
              U
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

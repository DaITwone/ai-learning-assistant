"use client";

import { KeyboardEvent, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputProps = {
  onSend: (content: string) => void;
};

export function ChatInput({ onSend }: ChatInputProps) {
  const [content, setContent] = useState("");

  function handleSubmit() {
    const trimmed = content.trim();

    if (!trimmed) return;

    onSend(trimmed);
    setContent("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="sticky bottom-0 shrink-0 bg-slate-50/95 px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur sm:px-4 sm:py-4 sm:pb-[calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-4xl">
        <div className="relative rounded-2xl border bg-muted/40 shadow-sm sm:rounded-3xl">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Khám phá kiến thức mới..."
            className="
              min-h-[52px]
              max-h-[160px]
              resize-none
              border-0
              bg-transparent
              pr-14
              pt-3.5
              text-sm
              shadow-none
              focus-visible:ring-0
              sm:min-h-[56px]
              sm:max-h-[200px]
              sm:pr-16
              sm:pt-4
              sm:text-base
            "
          />

          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              h-9
              w-9
              rounded-full
              sm:right-3
            "
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 px-1 text-center text-[11px] leading-4 text-muted-foreground sm:text-xs">
          AI có thể đưa ra gợi ý chưa hoàn toàn chính xác. Hãy kiểm tra lại các
          thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}

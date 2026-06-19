"use client";

import { Send } from "lucide-react";
import { useState, KeyboardEvent } from "react";

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
    <div className="sticky bottom-0 px-4 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-3xl border bg-muted/40 shadow-sm">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi kiến thức, phân tích code hoặc tạo quiz từ nội dung học..."
            className="
              min-h-[56px]
              max-h-[200px]
              resize-none
              border-0
              bg-transparent
              pr-16
              pt-4
              shadow-none
              focus-visible:ring-0
            "
          />

          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="
              absolute
              bottom-2.5
              right-3
              h-9
              w-9
              rounded-full
            "
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          AI có thể đưa ra gợi ý chưa hoàn toàn chính xác. Hãy kiểm tra lại các thông tin quan trọng.
        </p>
      </div>
    </div>
  );
}
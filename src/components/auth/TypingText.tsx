"use client";

import { useEffect, useState } from "react";

type TypingTextProps = {
  text: string;
  speed?: number;
};

export default function TypingText({ text, speed = 50 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;

    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;

      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

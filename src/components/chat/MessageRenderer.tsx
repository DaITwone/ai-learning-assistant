import type { ChatMessage } from "@/types/message";
import { CodeReviewCard } from "./CodeReviewCard";
import { QuizCard } from "./QuizCard";
import { RoadmapCard } from "./RoadmapCard";
import { TextMessage } from "./TextMessage";

type MessageRendererProps = {
  message: ChatMessage;
};

export function MessageRenderer({ message }: MessageRendererProps) {
  switch (message.type) {
    case "text":
      return <TextMessage content={message.content} />;

    case "quiz":
      return <QuizCard content={message.content} />;

    case "roadmap":
      return <RoadmapCard />;

    case "code_review":
      return <CodeReviewCard />;

    default:
      return null;
  }
}
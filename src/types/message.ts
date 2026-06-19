export type MessageRole = "user" | "assistant";

export type MessageType = "text" | "quiz" | "roadmap" | "code_review";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  createdAt: string;
};
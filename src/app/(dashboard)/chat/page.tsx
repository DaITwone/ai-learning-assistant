import { ChatPageClient } from "@/components/chat/ChatPageClient";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  return <ChatPageClient />;
}
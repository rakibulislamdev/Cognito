import { Conversation } from "@/lib/types/conversation";

export const fakeConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "Learn JavaScript",
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "How should I start JavaScript?",
        createdAt: new Date().toISOString(),
      },
      {
        id: "msg-2",
        role: "assistant",
        content: "Start with variables, loops and functions.",
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

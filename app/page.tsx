import LeftSidebar from '@/components/leftSidebar/LeftSidebar';
import MainChatArea from '@/components/mainChatArea/MainChatArea';

export const fakeConversations = [
  {
    id: "conv-1",
    title: "How to learn JavaScript?",
    updatedAt: "2026-01-10T10:30:00Z",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "How should I start learning JavaScript?",
        createdAt: "2026-01-10T10:00:00Z",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "You should start with basics like variables, loops, and functions.",
        createdAt: "2026-01-10T10:01:00Z",
      },
    ],
  },
  {
    id: "conv-2",
    title: "React vs Next.js",
    updatedAt: "2026-01-11T09:00:00Z",
    messages: [
      {
        id: "msg-3",
        role: "user",
        content: "What is the difference between React and Next.js?",
        createdAt: "2026-01-11T08:55:00Z",
      },
      {
        id: "msg-4",
        role: "assistant",
        content:
          "React is a library, Next.js is a framework built on top of React.",
        createdAt: "2026-01-11T08:56:00Z",
      },
    ],
  },
]

export default function Home() {
  return (
    <div className="flex h-screen mx-auto bg-white max-h-screen overflow-hidden">
      <LeftSidebar />
      <div className='flex-1 overflow-y-auto'>
        <MainChatArea />
      </div>
    </div>
  );
}

"use client"
import { useChat } from "@/context/ChatContext";
import { fakeConversations } from "@/data/fakeConversations";
import Link from "next/link";

export default function Conversations() {

    const { conversations } = useChat()
    console.log(conversations)

    return (
        <div className="pt-4 ">
            <span className="text-gray-500 text-xs uppercase font-semibold">
                Conversations
            </span>
            <div className="space-y-1  mt-3">
                {
                    conversations.map(conv => (
                        <Link
                            key={conv.id}
                            href={`/conversation/${conv.id}`}
                            className="flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer "
                        >
                            <span className="text-sm text-zinc-300">{conv.title}</span>
                        </Link>
                    ))
                }

            </div>
        </div>
    )
}

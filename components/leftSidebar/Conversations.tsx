"use client"
import { useChat } from "@/context/ChatContext";
import { fakeConversations } from "@/data/fakeConversations";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Conversations() {

    const { conversations } = useChat()
    console.log(conversations)
    const params = useParams()
    const activeId = params.conversationId

    const reverseConversations = [...conversations].reverse()

    return (
        <div className="pt-4 ">
            <span className="text-gray-500 text-xs uppercase font-semibold">
                Conversations
            </span>
            <div className="space-y-1  mt-3">
                {
                    reverseConversations.map(conv => {
                        const isActive = conv._id === activeId;
                        return (
                            <Link
                                key={conv._id}
                                href={`/conversation/${conv._id}`}
                                className={`flex items-center space-x-3 px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${isActive ? "bg-gray-800" : ""}`}
                            >
                                <span className="text-sm text-zinc-300">{conv.title}</span>
                            </Link>
                        )
                    })
                }

            </div>
        </div>
    )
}

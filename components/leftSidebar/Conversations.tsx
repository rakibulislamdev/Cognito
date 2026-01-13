"use client"
import { useChat } from "@/context/ChatContext";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Conversations() {
    const { conversations } = useChat();
    const params = useParams();
    const activeId = params.conversationId;

    const displayConversations = [...conversations].reverse();

    return (
        <div className="pt-4">
            <span className="text-gray-500 text-xs uppercase font-semibold px-3">
                Conversations
            </span>
            <div className="space-y-1 mt-3">
                {displayConversations.length === 0 ? (
                    <p className="text-gray-600 text-xs px-3">No chats yet</p>
                ) : (
                    displayConversations.map((conv) => {
                        const isActive = conv._id === activeId;
                        return (
                            <Link
                                key={conv._id}
                                href={`/conversation/${conv._id}`}
                                className={`flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ${isActive ? "bg-gray-800" : ""
                                    }`}
                            >
                                <span className={`text-sm truncate ${isActive ? "text-white" : "text-zinc-400"}`}>
                                    {conv.title || "Untitled Chat"}
                                </span>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}
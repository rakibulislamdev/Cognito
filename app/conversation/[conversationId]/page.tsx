"use client"
import { useEffect, useRef, useState } from "react";
import LeftSidebar from "@/components/leftSidebar/LeftSidebar";
import PromptBox from "@/components/mainChatArea/PromptBox";
import { useChat } from "@/context/ChatContext";
import { useParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from "lucide-react";
import ThinkingIndicator from "@/components/ThinkingIndicator";

export default function ConversationPage() {
    const { conversations, isTyping } = useChat();
    const params = useParams();
    const conversationId = params.conversationId;
    const [copied, setCopied] = useState<null | string>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const conver = conversations.find(conv => conv._id === conversationId);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [conver?.messages, isTyping]);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };


    if (!conver) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-500">Conversation not found</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            <LeftSidebar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">

                {/* Chat Header */}
                <div className="px-8 py-4 border-b border-gray-200 bg-white z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <h1 className="text-lg font-semibold text-gray-800 truncate">
                                {conver.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Chat Content Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto px-8 py-6 space-y-6 flex flex-col scroll-smooth"
                >
                    {conver.messages.map((msg) => (
                        <div key={msg._id} className="group flex items-start space-x-3 relative">
                            <div className={`w-8 h-8 flex-shrink-0 ${msg.role === "user"
                                ? "bg-blue-500"
                                : "bg-gradient-to-r from-purple-500 to-pink-500"
                                } rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                                {msg.role === "user" ? "U" : "AI"}
                            </div>

                            <div className="flex-1 relative">
                                <div className={`${msg.role === "user"
                                    ? "bg-gray-100"
                                    : "border-2 border-gray-100 bg-white"
                                    } rounded-2xl px-4 py-3 max-w-3xl inline-block shadow-sm relative`}>

                                    <div className="chat-markdown">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>


                                    <button
                                        onClick={() => handleCopy(msg.content, msg._id)}
                                        className={`absolute -bottom-4 ${msg.role === "user" ? "-left-2" : "-right-2"} p-1.5 rounded-lg bg-white text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-200 shadow-sm z-20`}
                                        title="Copy message"
                                    >
                                        {copied === msg._id ? (
                                            <div className="flex items-center space-x-1 px-1">
                                                <Check size={12} className="text-green-600" />
                                                <span className="text-[10px] font-medium text-green-600">Copied!</span>
                                            </div>
                                        ) : (
                                            <Copy size={13} />
                                        )}
                                    </button>
                                </div>

                                <span className="text-[10px] text-gray-400 mt-1 block px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <ThinkingIndicator />
                    )}
                </div>

                {/* Input Area */}
                <div className="bg-white border-t border-gray-100">
                    <PromptBox />
                </div>
            </div>
        </div>
    );
}